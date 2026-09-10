import { slugify,type Block } from './content';
export class InputError extends Error {}
export const mediaPattern=/^\/uploads\/[a-f0-9]{24,64}(?:-(?:800|1600))?\.(?:webp|mp4|webm)$/;
export function text(value:unknown,max:number,required=false){if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw new InputError('文字字段为空或超过长度限制');return value.trim();}
export function media(value:unknown,required=false){const s=text(value,200);if((required||s)&&!mediaPattern.test(s))throw new InputError('无效的上传文件路径');return s;}
export function validateBlocks(value:unknown):Block[]{
 if(!Array.isArray(value)||value.length>300)throw new InputError('描述区块无效');
 return value.map(v=>{
  if(!v||!['paragraph','heading','ul','ol','image','table'].includes(v.type))throw new InputError('无效的描述格式');
  const content=text(v.text,12000);
  if(v.type==='image'){
   const src=media(v.src,true);
   if(!src.endsWith('.webp')||!['wide','card'].includes(v.layout))throw new InputError('图文区块图片或版式无效');
   return {type:'image',text:content,src,layout:v.layout,detail:text(v.detail??'',12000)};
  }
  if(v.type==='table'){
   const rows=content.split('\n').map(r=>r.split('|'));
   if(rows.length<2||rows.length>30||rows[0].length<2||rows[0].length>6||rows.some(r=>r.length!==rows[0].length||r.some(c=>!c.trim())))throw new InputError('表格每行列数须一致，使用 | 分隔，第一行为表头');
  }
  return {type:v.type,text:content};
 });
}
export function validateWork(body:Record<string,unknown>){const title=text(body.title,200,true);const slug=text(body.slug||slugify(title),120,true);if(slugify(slug)!==slug)throw new InputError('URL 标识只允许文字、数字与短横线');if(!Array.isArray(body.images)||body.images.length>200||!Array.isArray(body.tags)||body.tags.length>20)throw new InputError('图片或标签数量无效');const images=body.images.map(v=>media(v,true));if(images.some(v=>!v.endsWith('.webp')))throw new InputError('图集仅支持图片');const cover=media(body.cover);if(cover&&!cover.endsWith('.webp'))throw new InputError('封面仅支持图片');const link=text(body.link,2000);if(link&&!/^https?:\/\//i.test(link))throw new InputError('外部链接必须是 HTTP 或 HTTPS');if(link)new URL(link);if(typeof body.published!=='boolean'||!Number.isInteger(body.order)||Math.abs(Number(body.order))>1000000)throw new InputError('发布状态或排序值无效');if(body.published&&!cover)throw new InputError('发布前请上传封面');const captions=Array.isArray(body.imageCaptions)?body.imageCaptions.map(v=>text(v,1000)):[];return {title,slug,cover,images,imageCaptions:images.map((_,i)=>captions[i]||''),summary:text(body.summary,2000),description:JSON.stringify(validateBlocks(body.description)),tags:body.tags.map(v=>text(v,50,true)),year:text(body.year,40),link,order:Number(body.order),published:body.published};}
export function validateSettings(body:Record<string,unknown>){const mode=text(body.mediaMode,20);if(!['carousel','image','video'].includes(mode))throw new InputError('无效的媒体模式');const path=mode==='carousel'?'':media(body.mediaPath,true);if(mode==='image'&&!path.endsWith('.webp')||mode==='video'&&!/\.(mp4|webm)$/.test(path))throw new InputError('媒体格式与模式不符');return {title:text(body.title,80,true),subtitle:text(body.subtitle,200,true),worksLabel:text(body.worksLabel,30,true),aboutLabel:text(body.aboutLabel,30,true),mediaMode:mode,mediaPath:path};}
