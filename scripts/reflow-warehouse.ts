import {PrismaClient} from '@prisma/client';
import {readFile,writeFile,mkdir,access,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {validateBlocks} from '../src/lib/validation';
import {descriptionImages} from '../src/lib/content';
const db=new PrismaClient();
const hash=(w:{description:string;images:unknown;imageCaptions:unknown})=>createHash('sha256').update(JSON.stringify({description:w.description,images:w.images,imageCaptions:w.imageCaptions})).digest('hex');
try{
 const plans=JSON.parse(await readFile('seed-data/warehouse-study.json','utf8'));
 const sources=JSON.parse(await readFile('seed-data/warehouse-sources.json','utf8'));
 const expected=['/project-brandslink-wms/','/project-oms/'];
 if(JSON.stringify(plans.map((p:{sourceKey:string})=>p.sourceKey))!==JSON.stringify(expected))throw Error('Only WMS and OMS may be upgraded');
 const seedText=await readFile('seed-data/content.json','utf8'),seed=JSON.parse(seedText);
 const updates=[];
 for(const plan of plans){
  const current=await db.work.findUniqueOrThrow({where:{sourceKey:plan.sourceKey}});
  const patch={description:JSON.stringify(validateBlocks(JSON.parse(plan.patch.description))),images:plan.patch.images as string[],imageCaptions:plan.patch.imageCaptions as string[]};
  const approved=sources.filter((s:{slug:string})=>`/project-${s.slug}/`===plan.sourceKey).map((s:{src:string})=>s.src);
  if(JSON.stringify(descriptionImages(patch.description))!==JSON.stringify(patch.images)||JSON.stringify(patch.images)!==JSON.stringify(approved)||patch.imageCaptions.length!==patch.images.length)throw Error('Reviewed image/text mapping mismatch');
  for(const src of patch.images)await access(path.join('public',src));
  const changed=hash(current)!==hash(patch);
  if(changed&&hash(current)!==plan.expectedHash)throw Error(`${current.slug}: content edited; review before applying upgrade`);
  const seedWork=seed.works.find((w:{sourceKey:string})=>w.sourceKey===plan.sourceKey);
  if(!seedWork)throw Error('Missing first-install record');
  Object.assign(seedWork,patch);updates.push({current,patch,changed});
 }
 const changed=updates.filter(u=>u.changed);
 if(changed.length){
  await mkdir('data/content-backups',{recursive:true});
  await writeFile(`data/content-backups/warehouse-${Date.now()}.json`,JSON.stringify(changed.map(u=>u.current),null,2),{flag:'wx'});
  await db.$transaction(async tx=>{
   for(const {current,patch} of changed){
    const result=await tx.work.updateMany({where:{id:current.id,updatedAt:current.updatedAt},data:patch});
    if(result.count!==1)throw Error('Concurrent edit; both content updates rolled back');
   }
  });
 }
 const next=JSON.stringify(seed,null,2);
 if(seedText!==next){
  if(await readFile('seed-data/content.json','utf8')!==seedText)throw Error('Seed changed concurrently; database preserved, review seed and rerun');
  const temp=`seed-data/warehouse-${Date.now()}.tmp`;await writeFile(temp,next,{flag:'wx'});await rename(temp,'seed-data/content.json');
 }
 console.log(`Warehouse studies: ${changed.length} records changed; metadata preserved; first-install content synchronized.`);
}finally{await db.$disconnect();}
