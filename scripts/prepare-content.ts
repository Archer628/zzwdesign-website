import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import sharp from 'sharp';
import type {Block} from '../src/lib/content';
const backup=path.resolve(process.cwd(),'../zzwdesign-backup');
const out=path.resolve('seed-data');
type Page={url:string;file:string;content:string;title:string;images:{url:string;local_reference:string;alt:string}[]};
type Resource={url:string;file:string;kind:string};
const map=JSON.parse(await readFile(path.join(backup,'site-map.json'),'utf8')) as {pages:Page[];resources:Resource[]};
const pages=map.pages.filter(p=>new URL(p.url).pathname.startsWith('/project-'));
if(pages.length!==9)throw new Error('Expected exactly nine source projects');
await mkdir(path.join(out,'media'),{recursive:true});
const warnings:string[]=[];
const provenance:unknown[]=[];
function rawLines(md:string){return md.split('## 页面原文')[1].split('## 导航')[0].split('\n').map(s=>s.trim().replace(/\u200b/g,'')).filter(Boolean);}
function safeResolve(file:string){const p=path.resolve(backup,file);if(!p.startsWith(backup+path.sep))throw new Error('Source path escapes backup');return p;}
function baseImage(url:string){return url.replace(/-\d+x\d+(?=\.[^.]+$)/,'').replace(/-scaled(?=\.[^.]+$)/,'');}
async function imageFile(local:string){const source=safeResolve(local);const data=await readFile(source);const id=createHash('sha256').update(data).digest('hex').slice(0,32);const meta=await sharp(data).metadata();for(const width of [800,1600]){const file=path.join(out,'media',`${id}-${width}.webp`);await sharp(data,{animated:true}).rotate().resize({width,withoutEnlargement:true}).webp({quality:80}).toFile(file);}return {file:`/uploads/${id}-1600.webp`,source:local,width:meta.width,height:meta.height};}
const candidates=new Map<string,Resource[]>();
for(const r of map.resources.filter(r=>r.kind==='image'&&r.file)){const key=baseImage(r.url);candidates.set(key,[...(candidates.get(key)||[]),r]);}
async function bestImage(page:Page,src:string){const local=path.relative(backup,path.resolve(backup,path.dirname(page.file),src)).replaceAll('\\','/');const original=map.resources.find(r=>r.file===local);const options=original?candidates.get(baseImage(original.url))||[original]:[];let chosen=local,max=0;for(const r of options){const meta=await sharp(safeResolve(r.file)).metadata();const area=(meta.width||0)*(meta.height||0);if(area>max){max=area;chosen=r.file;}}return imageFile(chosen);}
const result=[];
for(const [order,p] of pages.entries()){
 const md=await readFile(safeResolve(p.content),'utf8');const html=await readFile(safeResolve(p.file),'utf8');const $=load(html);const lines=rawLines(md);const title=$('h1,h2,h3').first().text().trim();if(!title)throw new Error('Source page title missing: '+p.url);const titleIndex=lines.indexOf(title);const yearIndex=lines.indexOf('项目年份');const year=lines[yearIndex-1];const headingSet=new Set($('h2,h3').map((_,e)=>$(e).text().trim().replace(/\u200b/g,'')).get());const start=lines.findIndex((s,i)=>i>yearIndex&&headingSet.has(s));const end=lines.indexOf('专注于创造卓越的数字产品体验');const description:Block[]=lines.slice(start,end<0?undefined:end).map(text=>({type:headingSet.has(text)?'heading':'paragraph',text}));const intro=lines.slice(titleIndex+1,yearIndex-1);const tagWords=['业务逻辑','用户体验','界面设计','复杂业务逻辑','UI组件','B端视觉','改版设计','数据管理支持'];const tags=intro.filter(s=>tagWords.includes(s));const summary=intro.find(s=>!tagWords.includes(s))||'';
 const sourceImages=$('img').map((_,e)=>({src:$(e).attr('src')||'',alt:$(e).attr('alt')||''})).get().filter(i=>i.src.startsWith('../images/')&&!/\.svg$|LOGO|logo|icon/i.test(i.src));const seen=new Set<string>();const media=[];for(const img of sourceImages){const asset=await bestImage(p,img.src);if(seen.has(asset.file))continue;seen.add(asset.file);media.push({...asset,caption:img.alt});}
 if(!media.length)throw new Error(`No images for ${p.url}`);
 const slug=new URL(p.url).pathname.replace(/^\/project-|\/$/g,'');
 const conflict=slug==='cirsureas-app';if(conflict)warnings.push('Owner approved Cirsureas App title and temperature-probe introduction instead of incorrect Michaels source h1/summary. Correct summary is sourced from works.md.');
 const links=$('a[href]').map((_,e)=>({href:$(e).attr('href')||'',text:$(e).text().trim()})).get();const external=links.find(a=>/^https?:\/\//.test(a.href)&&!/zzwdesign\.cn|beian\.miit/.test(a.href)&&/项目|官网|设计稿|APP下载/.test(a.text));
 result.push({sourceKey:new URL(p.url).pathname,title:conflict?'Cirsureas App':title,slug,summary:conflict?'无线智能温度探针产品配套应用程序':summary,year,tags,description:JSON.stringify(description),cover:media[0].file,images:media.slice(1).map(m=>m.file),imageCaptions:media.slice(1).map(m=>m.caption),link:external?.href||'',order,published:true});
 provenance.push({source:p.content,html:p.file,sourceSha256:createHash('sha256').update(md).digest('hex'),title,images:media});console.log(`${slug}: ${media.length} unique images`);
}
const aboutPage=map.pages.find(p=>new URL(p.url).pathname==='/about-me/')!;
const aboutLines=rawLines(await readFile(safeResolve(aboutPage.content),'utf8'));
const aStart=aboutLines.indexOf('10年经验');const aEnd=aboutLines.indexOf('专注于创造卓越的数字产品体验');
const aboutBlocks:Block[]=aboutLines.slice(aStart,aEnd).map(text=>({type:['工作经历','联系我'].includes(text)?'heading':'paragraph',text}));
const portrait=aboutPage.images.find(i=>i.alt==='设计师头像');let portraitFile='';if(portrait)portraitFile=(await bestImage(aboutPage,portrait.local_reference)).file;
await writeFile(path.join(out,'content.json'),JSON.stringify({works:result,settings:{aboutContent:JSON.stringify(aboutBlocks),aboutPortrait:portraitFile}},null,2));
await writeFile(path.join(out,'provenance.json'),JSON.stringify({source:backup,projects:provenance,warnings},null,2));
console.log(`Prepared ${result.length} projects, ${warnings.length} source warnings. Source backup unchanged.`);
