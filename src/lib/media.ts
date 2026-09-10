import path from 'node:path';
import { mkdir,writeFile,access,unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { InputError,mediaPattern } from './validation';
export const uploads=path.join(process.cwd(),'public','uploads');
export async function imageFiles(buffer:Buffer){
 const id=createHash('sha256').update(buffer).digest('hex').slice(0,32);
 const result=`/uploads/${id}-1600.webp`;
 await mkdir(uploads,{recursive:true});
 try{await access(path.join(uploads,`${id}-1600.webp`));await access(path.join(uploads,`${id}-800.webp`));return result;}catch{/* Generate both variants before reporting success. */}
 const created:string[]=[];
 try{
  for(const size of [800,1600]){
   const bytes=await sharp(buffer,{animated:true,limitInputPixels:100000000}).rotate().resize({width:size,withoutEnlargement:true}).webp({quality:80}).toBuffer();
   const dest=path.join(uploads,`${id}-${size}.webp`);
   try{await writeFile(dest,bytes,{flag:'wx'});created.push(dest);}catch(e){if((e as NodeJS.ErrnoException).code!=='EEXIST')throw e;}
  }
  return result;
 }catch(e){await Promise.all(created.map(p=>unlink(p).catch(()=>{})));throw e;}
}
export async function saveUpload(file:File){if(file.size===0||file.size>10*1024*1024)throw new InputError('文件必须在 0–10MB 之间');const ext=path.extname(file.name).toLowerCase();const data=Buffer.from(await file.arrayBuffer());if(['.jpg','.jpeg','.png','.webp','.gif'].includes(ext)){const info=await sharp(data,{animated:true,limitInputPixels:100000000}).metadata();const expected:Record<string,string>={'.jpg':'jpeg','.jpeg':'jpeg','.png':'png','.webp':'webp','.gif':'gif'};if(info.format!==expected[ext])throw new InputError('文件实际类型与扩展名不符');return imageFiles(data);}if(ext==='.mp4'||ext==='.webm'){const valid=ext==='.mp4'?data.length>16&&data.subarray(4,8).toString()==='ftyp'&&/isom|iso[2-9]|mp4[12]|avc1|M4V /.test(data.subarray(8,64).toString()):data.length>16&&data.subarray(0,4).equals(Buffer.from([0x1a,0x45,0xdf,0xa3]))&&data.subarray(0,4096).includes(Buffer.from('webm'));if(!valid)throw new InputError('视频容器格式无效');const id=createHash('sha256').update(data).digest('hex').slice(0,32);await mkdir(uploads,{recursive:true});await writeFile(path.join(uploads,id+ext),data,{flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e;});return '/uploads/'+id+ext;}throw new InputError('不支持的文件格式');}
export async function assertMediaExists(paths:string[]){for(const p of paths.filter(Boolean)){if(!mediaPattern.test(p))throw new InputError('非法媒体路径');try{await access(path.join(uploads,path.basename(p)));}catch{throw new InputError('引用的上传文件不存在');}}}
