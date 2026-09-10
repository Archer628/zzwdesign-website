import {PrismaClient} from '@prisma/client';
import {readFile,writeFile,mkdir,access,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {validateBlocks} from '../src/lib/validation';
import {descriptionImages} from '../src/lib/content';
const db=new PrismaClient();
const hash=(w:{description:string;images:unknown;imageCaptions:unknown})=>createHash('sha256').update(JSON.stringify({description:w.description,images:w.images,imageCaptions:w.imageCaptions})).digest('hex');
try{
 const plans=JSON.parse(await readFile('seed-data/remaining-study.json','utf8'));
 const sources=JSON.parse(await readFile('seed-data/remaining-study-sources.json','utf8'));
 const allowed=['/project-michaels-buyer-app/','/project-michaels-ops-management-system/','/project-michaels-official-website-new-platform/'];
 if(JSON.stringify(plans.map((p:{sourceKey:string})=>p.sourceKey))!==JSON.stringify(allowed))throw Error('Only the three approved Michaels studies may be updated');
 const seedText=await readFile('seed-data/content.json','utf8'),seed=JSON.parse(seedText),updates=[];
 for(const plan of plans){
  const current=await db.work.findUniqueOrThrow({where:{sourceKey:plan.sourceKey}});
  const patch={description:JSON.stringify(validateBlocks(JSON.parse(plan.patch.description))),images:plan.patch.images as string[],imageCaptions:plan.patch.imageCaptions as string[]};
  const approved=sources.filter((s:{slug:string})=>`/project-${s.slug}/`===plan.sourceKey);
  if(JSON.stringify(descriptionImages(patch.description))!==JSON.stringify(patch.images)||JSON.stringify(approved.map((s:{src:string})=>s.src))!==JSON.stringify(patch.images)||JSON.stringify(approved.map((s:{caption:string})=>s.caption))!==JSON.stringify(patch.imageCaptions))throw Error('Reviewed image mapping mismatch');
  for(const src of patch.images)for(const size of ['1600','800']){const name=src.replace('-1600.webp',`-${size}.webp`);await access('public'+name);await access('seed-data/media/'+name.split('/').pop());}
  const changed=hash(current)!==hash(patch);
  if(changed&&hash(current)!==plan.expectedHash)throw Error(`${current.slug}: content edited; review before applying upgrade`);
  const seedWork=seed.works.find((w:{sourceKey:string})=>w.sourceKey===plan.sourceKey);
  if(!seedWork)throw Error('Missing first-install record');
  Object.assign(seedWork,patch);updates.push({current,patch,changed});
 }
 if(process.argv.includes('--check')){console.log('Three content plans validated; no changes written.');}
 else{
  const changed=updates.filter(u=>u.changed);
  if(changed.length){
   await mkdir('data/content-backups',{recursive:true});
   await writeFile(`data/content-backups/remaining-study-${Date.now()}.json`,JSON.stringify(changed.map(u=>u.current),null,2),{flag:'wx'});
   await db.$transaction(async tx=>{
    for(const {current,patch} of changed){
     const result=await tx.work.updateMany({where:{id:current.id,updatedAt:current.updatedAt},data:patch});
     if(result.count!==1)throw Error('Concurrent edit; all three content changes rolled back');
    }
   });
  }
  const next=JSON.stringify(seed,null,2);
  if(seedText!==next){
   if(await readFile('seed-data/content.json','utf8')!==seedText)throw Error('Seed changed concurrently; database preserved, review seed and rerun');
   const temp=`seed-data/remaining-study-${Date.now()}.tmp`;await writeFile(temp,next,{flag:'wx'});await rename(temp,'seed-data/content.json');
  }
  console.log(`Remaining studies: ${changed.length} records changed; metadata preserved; first-install content synchronized.`);
 }
}finally{await db.$disconnect();}
