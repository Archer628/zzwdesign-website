import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
const results=[];
try{
 for(const [width,height] of [[1920,1080],[1600,1000],[1440,900],[1280,720],[768,1024],[390,844]]){
  await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:33100/');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(600);
  const layout=await page.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,shell:rect('.site-shell'),intro:rect('.home-intro'),content:rect('.intro-bottom'),headline:rect('h1'),waterfall:rect('.waterfall'),logo:rect('.site-logo'),media:document.querySelectorAll('.home-intro img,.home-intro video').length,nav:document.querySelectorAll('.site-header nav').length,cards:[...new Set([...document.querySelectorAll('.waterfall .work-card')].map(e=>Math.round(e.getBoundingClientRect().height*100)/100))],groups:[...document.querySelectorAll('.waterfall-group')].map(e=>Math.round(e.getBoundingClientRect().height*100)/100),tracks:[...document.querySelectorAll('.waterfall-track')].map(e=>getComputedStyle(e).transform),glass:getComputedStyle(document.querySelector('.site-header')).backdropFilter,blur:[...document.querySelectorAll('.waterfall-fade i')].map(e=>getComputedStyle(e).backdropFilter)};});
  assert.equal(layout.overflow,false);assert.equal(layout.media,0);assert.equal(layout.nav,0);assert.equal(layout.cards.length,1);assert.ok(layout.shell.width<=1600);if(width>=1024){assert.ok(Math.abs(layout.intro.width/layout.shell.width-.4)<.001);assert.ok(Math.abs(layout.waterfall.width/layout.shell.width-.45)<.001);assert.ok(Math.abs(layout.content.y+layout.content.height/2-layout.intro.y-layout.intro.height/2)<1);}
  assert.ok(layout.tracks.every(t=>!t.includes('NaN')));results.push(layout);const shot=await page.screenshot({path:`evidence/scroll-fonts/home-${width}.png`});
  const {data,info}=await sharp(shot).removeAlpha().raw().toBuffer({resolveWithObject:true});let ink=0;for(let y=Math.ceil(layout.headline.y);y<Math.min(info.height,layout.headline.y+layout.headline.height);y++){for(let x=Math.ceil(layout.headline.x);x<layout.headline.x+layout.headline.width;x++){const i=(y*info.width+x)*info.channels;if(data[i]<60&&data[i+1]<60&&data[i+2]<60)ink++;}}assert.ok(ink>300,'Headline must actually paint into screenshot, not just exist in DOM');
 }
 await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:33100/');await page.mouse.move(20,300);await page.waitForTimeout(700);
 const tracks=()=>page.locator('.waterfall-track').evaluateAll(es=>es.map(e=>({y:new DOMMatrix(getComputedStyle(e).transform).m42,rate:e.getAnimations()[0]?.playbackRate})));
 const visible=()=>page.locator('.waterfall').evaluate(e=>{const r=e.getBoundingClientRect();return [...e.querySelectorAll('.work-card')].map(c=>({href:c.getAttribute('href'),x:c.getBoundingClientRect().x,y:c.getBoundingClientRect().y})).filter(c=>c.y>r.top+100&&c.y<r.bottom-100);});
 const before=await tracks();await page.waitForTimeout(600);const after=await tracks();assert.ok(after.every((x,i)=>x.y>before[i].y));
 const box=await page.locator('.waterfall').boundingBox();await page.mouse.move(box.x+60,box.y+180);await page.waitForTimeout(1400);const hovered=await tracks();assert.ok(hovered.every(x=>x.rate>.95));
 await page.mouse.wheel(0,-25);await page.waitForTimeout(300);const slowed=await tracks();assert.ok(slowed.every(x=>x.rate>0&&x.rate<.99));
 await page.mouse.wheel(0,350);await page.waitForTimeout(300);const accelerated=await tracks();assert.ok(accelerated.every(x=>x.rate>1.5));
 await page.mouse.wheel(0,-1500);await page.waitForTimeout(500);const reversed=await tracks();assert.ok(reversed.every(x=>x.rate<0));
 await page.locator('.waterfall-track').evaluateAll(es=>es.forEach(e=>{const a=e.getAnimations()[0];a.currentTime=Number(a.effect.getTiming().duration)+60;}));const reverseBefore=await visible();await page.waitForTimeout(350);const reverseAfter=await visible();let reverseMatches=0;for(const card of reverseBefore){const next=reverseAfter.find(c=>c.href===card.href&&c.x===card.x);if(next){reverseMatches++;assert.ok(next.y-card.y<0&&next.y-card.y>-160);}}assert.ok(reverseMatches>0);assert.ok((await tracks()).every(x=>x.rate<0));assert.ok(await page.locator('.waterfall-track').evaluateAll(es=>es.every(e=>e.getAnimations()[0].playState==='running')));
 await page.waitForTimeout(6500);
 await page.screenshot({path:'evidence/scroll-fonts/hover.png'});await page.mouse.move(20,300);await page.waitForTimeout(100);const easing=await tracks();assert.ok(easing.every(x=>x.rate>.95&&x.rate<1.05));await page.waitForTimeout(900);const resumed=await tracks();assert.ok(resumed.every(x=>x.rate>.95));
 // Advance the real browser animation to its seam, then compare visible card coordinates across the wrap.
 await page.locator('.waterfall-track').evaluateAll(es=>es.forEach(e=>{const a=e.getAnimations()[0];a.currentTime=Number(a.effect.getTiming().duration)-120;}));
const seamBefore=await visible();await page.waitForTimeout(300);const seamAfter=await visible();assert.ok(seamBefore.length>0);for(const card of seamBefore){const next=seamAfter.find(c=>c.href===card.href&&c.x===card.x);if(next)assert.ok(next.y-card.y>0&&next.y-card.y<20);}
 await page.locator('.waterfall-group:not([aria-hidden]) .work-card').nth(5).focus();await page.waitForTimeout(1400);assert.ok((await tracks()).every(x=>x.rate===0));assert.ok(await page.evaluate(()=>{const a=document.activeElement.getBoundingClientRect(),r=document.querySelector('.waterfall').getBoundingClientRect();return a.top>=r.top&&a.bottom<=r.bottom;}));
 // Latest explicit autoplay requirement also applies when the browser requests reduced motion.
 // Decorative transitions stay disabled; keyboard focus still pauses the tracks.
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:33100/');await page.waitForTimeout(700);
 const reducedBefore=await tracks();await page.waitForTimeout(600);const reducedAfter=await tracks();assert.ok(reducedAfter.every((x,i)=>x.y>reducedBefore[i].y));
 assert.equal(await page.getByRole('button',{name:/暂停滚动|继续滚动/}).count(),0);
 assert.equal(await page.locator('.work-card').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
 await page.screenshot({path:'evidence/scroll-fonts/reduced-motion.png'});results.push({motion:{before,after,hovered,slowed,accelerated,reversed,easing,resumed,seamBefore,seamAfter,reverseBefore,reverseAfter,reduced:true,focusPause:true}});
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('http://127.0.0.1:33100/');await page.evaluate(()=>document.fonts.ready);
 const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const {root}=await cdp.send('DOM.getDocument');const fonts={};for(const selector of ['h1','.intro-actions .primary']){const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});fonts[selector]=(await cdp.send('CSS.getPlatformFontsForNode',{nodeId})).fonts;}
 assert.ok(fonts.h1.some(f=>f.familyName.includes('Nunito Sans')&&f.isCustomFont));assert.ok(fonts['.intro-actions .primary'].some(f=>f.familyName.includes('MiSans')&&f.isCustomFont));
 const surfaces=await page.evaluate(()=>({body:getComputedStyle(document.body).backgroundColor,waterfall:getComputedStyle(document.querySelector('.waterfall')).backgroundColor,scrollbar:getComputedStyle(document.querySelector('.waterfall')).scrollbarWidth,rootScrollbar:getComputedStyle(document.documentElement).scrollbarWidth,shadow:getComputedStyle(document.querySelector('.work-card')).boxShadow}));assert.equal(surfaces.body,surfaces.waterfall);assert.equal(surfaces.scrollbar,'none');assert.equal(surfaces.rootScrollbar,'none');results.push({fonts,surfaces});
 await fs.writeFile('evidence/scroll-fonts/verification.json',JSON.stringify(results,null,2));console.log('PASS six widths, equal cards, layout, media removed, glass/blur, automatic motion, wheel acceleration/deceleration/reversal, seams, keyboard, reduced motion and actual web fonts');
}finally{await browser.close();}
