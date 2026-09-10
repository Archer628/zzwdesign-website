import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
process.loadEnvFile('.env');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
const results=[];
async function check(path,width){
 await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:33100'+path);await page.evaluate(()=>document.fonts.ready);
 if(path==='/admin/works')await page.locator('.row-title').first().waitFor();
 const result=await page.evaluate(()=>{
  const texts=[...document.body.querySelectorAll('*')].filter(e=>!['SCRIPT','STYLE','OPTION'].includes(e.tagName)&&e.getClientRects().length&&([...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())||['INPUT','TEXTAREA','SELECT'].includes(e.tagName)));
  const invalid=texts.map(e=>({text:e.textContent.trim().slice(0,30),size:parseFloat(getComputedStyle(e).fontSize),spacing:getComputedStyle(e).letterSpacing})).filter(e=>e.size<14||!['normal','0px'].includes(e.spacing));
  const clippedCopy=[...document.querySelectorAll('.waterfall .card-copy')].filter(e=>e.scrollHeight>e.clientHeight+1).length;
  return {invalid,checked:texts.length,overflow:document.documentElement.scrollWidth>innerWidth,clippedCopy};
 });
 results.push({path,width,...result});assert.deepEqual(result.invalid,[],`${path} ${width} typography`);assert.equal(result.overflow,false,`${path} ${width} overflow`);assert.equal(result.clippedCopy,0);
 if(path==='/'||path==='/admin/works/new')await page.screenshot({path:`evidence/typography-motion/${path==='/'?'home':'admin-new'}-${width}.png`,fullPage:true});
}
try{
 await page.goto('http://127.0.0.1:33100/works');
 const detail=await page.locator('.work-card').first().getAttribute('href');
 for(const width of [1440,390])for(const path of ['/','/works',detail,'/about','/not-a-page','/admin/login'])await check(path,width);
 await page.getByLabel('账号').fill(process.env.ADMIN_USER);await page.getByLabel('密码').fill(process.env.ADMIN_PASSWORD);await page.getByRole('button',{name:'登录后台'}).click();await page.waitForURL('**/admin');
 for(const width of [1440,390])for(const path of ['/admin','/admin/works','/admin/works/new','/admin/settings'])await check(path,width);
 await page.goto('http://127.0.0.1:33100/admin/works');await page.locator('.row-title').first().waitFor();const edit=await page.locator('.row-title').first().getAttribute('href');
 for(const width of [1440,390])await check(edit,width);
 await fs.writeFile('evidence/typography-motion/typography.json',JSON.stringify(results,null,2));console.log(`PASS ${results.length} desktop/mobile page checks: min 14px, zero letter spacing, no page overflow, no clipped card copy; authenticated admin read only`);
}finally{await browser.close();}
