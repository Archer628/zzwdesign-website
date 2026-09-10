import {PrismaClient,type Work} from '@prisma/client';
import {readFile,writeFile,mkdir,access,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {validateBlocks} from '../src/lib/validation';
import {descriptionImages} from '../src/lib/content';

// Explicit approved content upgrade. Regular seed remains insert-only.
const db=new PrismaClient();
type Patch={description:string;images:string[];imageCaptions:string[]};
const hash=(w:{description:string;images:unknown;imageCaptions:unknown})=>createHash('sha256').update(JSON.stringify({description:w.description,images:w.images,imageCaptions:w.imageCaptions})).digest('hex');
try{
 const plans=JSON.parse(await readFile('seed-data/reflow-remaining.json','utf8')) as {sourceKey:string;expectedHash:string;patch:Patch}[];
 if(plans.length!==8||new Set(plans.map(p=>p.sourceKey)).size!==8||plans.some(p=>p.sourceKey==='/project-michaels-self-checkout/'))throw Error('Expected eight distinct remaining projects');
 const seedText=await readFile('seed-data/content.json','utf8');const seed=JSON.parse(seedText);
 const updates:{current:Work;patch:Patch}[]=[];
 for(const plan of plans){
  plan.patch.description=JSON.stringify(validateBlocks(JSON.parse(plan.patch.description)));
  if(JSON.stringify(descriptionImages(plan.patch.description))!==JSON.stringify(plan.patch.images)||plan.patch.imageCaptions.length!==plan.patch.images.length)throw Error('Image mapping mismatch');
  for(const src of plan.patch.images)await access(path.join('public',src));
  const current=await db.work.findUniqueOrThrow({where:{sourceKey:plan.sourceKey}});
  if(hash(current)!==hash(plan.patch)){
   if(hash(current)!==plan.expectedHash)throw Error('Existing content edited; review before upgrade: '+plan.sourceKey);
   updates.push({current,patch:plan.patch});
  }
  const firstInstall=seed.works.find((w:{sourceKey:string})=>w.sourceKey===plan.sourceKey);
  if(!firstInstall)throw Error('Missing first-install record');Object.assign(firstInstall,plan.patch);
 }
 if(updates.length){
  await mkdir('data/content-backups',{recursive:true});
  await writeFile(`data/content-backups/remaining-${Date.now()}.json`,JSON.stringify(updates.map(x=>x.current),null,2),{flag:'wx'});
  await db.$transaction(async tx=>{
   for(const {current,patch} of updates){const changed=await tx.work.updateMany({where:{id:current.id,updatedAt:current.updatedAt},data:patch});if(changed.count!==1)throw Error('Concurrent edit; entire upgrade rolled back');}
  });
 }
 const nextSeed=JSON.stringify(seed,null,2);
 if(nextSeed!==seedText){
  if(await readFile('seed-data/content.json','utf8')!==seedText)throw Error('Seed changed concurrently; database safe, rerun after review');
  const temp=`seed-data/content-${Date.now()}.tmp`;await writeFile(temp,nextSeed,{flag:'wx'});await rename(temp,'seed-data/content.json');
 }
 console.log(`Remaining case upgrade: ${updates.length} records changed; existing metadata preserved; first-install content synchronized.`);
}finally{await db.$disconnect();}
