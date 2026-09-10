import { PrismaClient } from '@prisma/client';
import {readFile,mkdir,copyFile,access} from 'node:fs/promises';
import path from 'node:path';
import {constants} from 'node:fs';
import {defaults,descriptionImages} from '../src/lib/content';
const db=new PrismaClient();
try{
 const content=JSON.parse(await readFile(path.resolve('seed-data/content.json'),'utf8'));
 const upload=path.resolve('public/uploads');await mkdir(upload,{recursive:true});
 let created=0;
 for(const work of content.works){if(await db.work.findUnique({where:{sourceKey:work.sourceKey}}))continue;
  for(const p of new Set([work.cover,...work.images,...descriptionImages(work.description)]))for(const suffix of ['1600','800']){const name=path.basename(p).replace('-1600','-'+suffix);const dest=path.join(upload,name);try{await access(dest);}catch{await copyFile(path.resolve('seed-data/media',name),dest,constants.COPYFILE_EXCL);}}
  await db.work.create({data:work});created++;
 }
 for(const [key,value] of Object.entries({...defaults,...content.settings})){if(await db.setting.findUnique({where:{key}}))continue;if(key==='aboutPortrait'&&value){for(const size of ['1600','800']){const name=path.basename(value as string).replace('-1600','-'+size);await copyFile(path.resolve('seed-data/media',name),path.join(upload,name),constants.COPYFILE_EXCL).catch(e=>{if(e.code!=='EEXIST')throw e;});}}await db.setting.create({data:{key,value:String(value)}});}
 console.log(`Seed complete: ${created} added; existing records/settings preserved.`);
}finally{await db.$disconnect();}
