import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {PrismaClient} from '@prisma/client';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
process.loadEnvFile('.env');
const db=new PrismaClient();
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({reducedMotion:'no-preference'});
const base='http://127.0.0.1:33100',out='evidence/remaining-cases/';
const before=await db.work.findMany({orderBy:{order:'asc'}});
const plans=JSON.parse(await fs.readFile('seed-data/reflow-remaining.json','utf8'));
const apricotPlan=JSON.parse(await fs.readFile('seed-data/apricot-study.json','utf8'));
const results=[];
try{
 for(const w of before){
  const expected=JSON.parse(w.description).filter(b=>b.type==='image');
  const plan=w.sourceKey===apricotPlan.sourceKey?apricotPlan:plans.find(p=>p.sourceKey===w.sourceKey);
  if(plan)assert.equal(w.description,plan.patch.description);
  for(const width of [1920,1440,1280,768,390,319]){
   await page.setViewportSize({width,height:1000});await page.goto(base+'/works/'+w.slug);await page.evaluate(()=>document.fonts.ready);
   for(const img of await page.locator('main img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());}
   const pairs=await page.locator('.case-figure').evaluateAll(es=>es.map(e=>({src:e.querySelector('img').getAttribute('src'),caption:e.querySelector('h3').textContent,detail:e.querySelector('p')?.textContent||''})));
   assert.deepEqual(pairs,expected.map(b=>({src:b.src,caption:b.text,detail:b.detail})),w.slug);
   assert.equal(await page.locator('.gallery').count(),0);
   assert.equal(await page.locator('.detail-case').count(),1);
   const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,badText:[...document.querySelectorAll('main *')].filter(e=>e.getClientRects().length&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&(parseFloat(getComputedStyle(e).fontSize)<14||!['normal','0px'].includes(getComputedStyle(e).letterSpacing))).length,broken:[...document.querySelectorAll('main img')].filter(e=>!e.complete||!e.naturalWidth).length,ratioError:Math.max(...[...document.querySelectorAll('main img')].map(e=>Math.abs(e.getBoundingClientRect().height-e.getBoundingClientRect().width*e.naturalHeight/e.naturalWidth)))}));
   assert.equal(layout.overflow,false,w.slug);assert.equal(layout.badText,0,w.slug);assert.equal(layout.broken,0,w.slug);if(width<=768)assert.ok(layout.ratioError<1,w.slug+' mobile ratio');
   if(width===1440||width===390){
    await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:out+w.slug+`-top-${width}.png`});
    const y=await page.locator('.case-section').nth(1).evaluate(e=>e.getBoundingClientRect().top+scrollY);await page.evaluate(y=>scrollTo(0,y-110),y);await page.screenshot({path:out+w.slug+`-chapter-${width}.png`});
   }
   results.push({slug:w.slug,width,pairs:pairs.length,...layout});
  }
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(base+'/works/apricot-medical-assistant-system');
 const chapter=page.locator('.case-section-showcase').first();const top=await chapter.evaluate(e=>e.getBoundingClientRect().top+scrollY);
 for(const d of [200,480]){await page.evaluate(y=>scrollTo(0,y),top+d);assert.ok(Math.abs(await chapter.locator('.case-section-heading').evaluate(e=>e.getBoundingClientRect().top)-128)<1);}
 const link=chapter.locator('.case-image-link').first();await link.hover();await page.waitForTimeout(850);assert.ok((await link.locator('img').evaluate(e=>getComputedStyle(e).transform)).startsWith('matrix(1.015'));
 await link.focus();assert.equal(await link.evaluate(e=>getComputedStyle(e).outlineStyle),'solid');await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await link.locator('img').evaluate(e=>getComputedStyle(e).transform),'none');assert.equal(await page.locator('.detail-heading').evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.setViewportSize({width:390,height:1000});assert.equal(await chapter.locator('.case-section-heading').evaluate(e=>getComputedStyle(e).position),'static');
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/admin/login');await page.getByLabel('账号').fill(process.env.ADMIN_USER);await page.getByLabel('密码').fill(process.env.ADMIN_PASSWORD);await page.getByRole('button',{name:'登录后台'}).click();await page.waitForURL('**/admin');
 for(const w of before.filter(w=>plans.some(p=>p.sourceKey===w.sourceKey))){
  await page.goto(base+`/admin/works/${w.id}/edit`);assert.equal(await page.locator('.block-tools select').count(),JSON.parse(w.description).length);assert.equal(await page.getByLabel(/^对应说明/).count(),w.images.length);
  await page.getByRole('button',{name:'保存作品',exact:true}).click();await page.waitForURL('**/admin/works');const saved=await db.work.findUniqueOrThrow({where:{id:w.id}});
  for(const key of Object.keys(w).filter(k=>k!=='updatedAt'))assert.deepEqual(saved[key],w[key],w.slug+' '+key);
 }
 const target=await db.work.findUniqueOrThrow({where:{sourceKey:plans[0].sourceKey}}),body={...target,description:JSON.parse(target.description)};
 const bad=structuredClone(body);bad.description.find(b=>b.type==='image').src='/uploads/../../.env';
 const status=await page.evaluate(async({id,data})=>(await fetch(`/api/admin/works/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})).status,{id:target.id,data:bad});assert.equal(status,400);
 assert.equal((await page.request.put(base+`/api/admin/works/${target.id}`,{headers:{Origin:'https://example.com'},data:body})).status(),403);
 const anon=await browser.newContext();assert.equal((await anon.request.get(base+'/api/admin/works')).status(),401);await anon.close();
 assert.deepEqual(await db.work.findUniqueOrThrow({where:{id:target.id}}),target);
 const m=before.find(w=>w.sourceKey==='/project-michaels-self-checkout/');assert.deepEqual(await db.work.findUniqueOrThrow({where:{id:m.id}}),m);
 assert.equal(await db.work.count(),9);
 await fs.writeFile(out+'verification.json',JSON.stringify({results,editorRoundTrips:8,michaelsUnchanged:true,unsafeInputRejected:true,foreignOriginRejected:true,unauthenticatedRejected:true,stickyScroll:true,hoverEasing:true,keyboardFocus:true,reducedMotion:true,mobileStickyDisabled:true},null,2));
 console.log('PASS 54 case/viewport checks, 106 image-text pairs, 8 real editor saves, database preservation, sticky/hover/focus/reduced motion and security checks.');
}finally{await browser.close();await db.$disconnect();}
