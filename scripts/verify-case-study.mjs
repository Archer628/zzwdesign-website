import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {PrismaClient} from '@prisma/client';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
process.loadEnvFile('.env');
const db=new PrismaClient();
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
const base='http://127.0.0.1:33100';
const w=await db.work.findUniqueOrThrow({where:{sourceKey:'/project-michaels-self-checkout/'}});
const before=JSON.parse(JSON.stringify(await db.work.findMany({orderBy:{id:'asc'}})));
const expected=JSON.parse(w.description).filter(b=>b.type==='image');
const results=[];
try{
 for(const width of [1920,1440,1280,768,390,319]){
  await page.setViewportSize({width,height:1000});await page.goto(base+'/works/'+w.slug);await page.evaluate(()=>document.fonts.ready);
  for(const img of await page.locator('main img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());}
  const pairs=await page.locator('.case-figure').evaluateAll(es=>es.map(e=>({src:e.querySelector('img').getAttribute('src'),caption:e.querySelector('h3').textContent,detail:e.querySelector('p')?.textContent||''})));
  assert.deepEqual(pairs,expected.map(b=>({src:b.src,caption:b.text,detail:b.detail})));
  assert.equal(await page.locator('.gallery').count(),0);
  const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,badText:[...document.querySelectorAll('main *')].filter(e=>e.getClientRects().length&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&(parseFloat(getComputedStyle(e).fontSize)<14||!['normal','0px'].includes(getComputedStyle(e).letterSpacing))).length,broken:[...document.querySelectorAll('main img')].filter(e=>!e.complete||!e.naturalWidth).length}));
  assert.equal(layout.overflow,false);assert.equal(layout.badText,0);assert.equal(layout.broken,0);
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`evidence/michaels-layout/top-${width}.png`});
  if(width===1440||width===390)for(const [i,name] of [[1,'localization'],[4,'personas'],[5,'flow'],[6,'kiosk']])await page.locator('.case-section').nth(i).screenshot({path:`evidence/michaels-layout/${name}-${width}.png`});
  results.push({width,...layout,pairs:pairs.length});
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/admin/login');await page.getByLabel('账号').fill(process.env.ADMIN_USER);await page.getByLabel('密码').fill(process.env.ADMIN_PASSWORD);await page.getByRole('button',{name:'登录后台'}).click();await page.waitForURL('**/admin');
 await page.goto(base+`/admin/works/${w.id}/edit`);
 assert.equal(await page.locator('.block-tools select').count(),39);
 assert.equal(await page.getByLabel(/^对应说明/).count(),20);
 // Save the reviewed content through the real editor and check its persistent round trip.
 await page.getByRole('button',{name:'保存作品',exact:true}).click();await page.waitForURL('**/admin/works');
 const saved=await db.work.findUniqueOrThrow({where:{id:w.id}});
 for(const field of ['description','images','imageCaptions','title','slug','cover','summary','year','tags','order','published','link'])assert.deepEqual(saved[field],w[field],field);
 const body={...saved,description:JSON.parse(saved.description)};
 const imageIndex=body.description.findIndex(b=>b.type==='image');
 for(const src of ['/uploads/../../.env','/uploads/'+'0'.repeat(32)+'-1600.webp']){
  const invalid=structuredClone(body);invalid.description[imageIndex].src=src;
  // Use the authenticated browser's normal fetch path (Secure cookies on loopback).
  const status=await page.evaluate(async({id,data})=>(await fetch(`/api/admin/works/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})).status,{id:w.id,data:invalid});assert.equal(status,400);
 }
 const foreign=await page.request.put(base+`/api/admin/works/${w.id}`,{headers:{Origin:'https://example.com'},data:body});assert.equal(foreign.status(),403);
 const anon=await browser.newContext();assert.equal((await anon.request.get(base+'/api/admin/works')).status(),401);await anon.close();
 assert.equal((await db.work.findUniqueOrThrow({where:{id:w.id}})).description,w.description);
 const after=JSON.parse(JSON.stringify(await db.work.findMany({orderBy:{id:'asc'}})));
 assert.deepEqual(after.filter(x=>x.id!==w.id),before.filter(x=>x.id!==w.id));assert.equal(after.length,9);
 // The other cases are now approved editorial descriptions; preserve their current content.
 const other=after.find(x=>x.id!==w.id&&x.published);await page.goto(base+'/works/'+other.slug);const inline=JSON.parse(other.description).filter(b=>b.type==='image');assert.equal(await page.locator('.case-story').count(),inline.length?1:0);assert.equal(await page.locator('.case-figure').count(),inline.length);assert.equal(await page.locator('.gallery figure').count(),other.images.filter(src=>!inline.some(b=>b.src===src)).length);
 await fs.writeFile('evidence/michaels-layout/verification.json',JSON.stringify({results,editorRoundTrip:true,unsafeInputRejected:true,foreignOriginRejected:true,unauthenticatedRejected:true,otherEightUnchanged:true,workCount:after.length},null,2));
 console.log('PASS 6 viewports, 20 exact image/text pairs, assets, typography, real editor save, database round trip, rejected unsafe requests, 8 other records unchanged.');
}finally{await browser.close();await db.$disconnect();}
