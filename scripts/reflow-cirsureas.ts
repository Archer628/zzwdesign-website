import {PrismaClient} from '@prisma/client';
import {readFile,writeFile,mkdir,access,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {validateBlocks} from '../src/lib/validation';
import {descriptionImages} from '../src/lib/content';
const db=new PrismaClient();
const hash=(w:{description:string;images:unknown;imageCaptions:unknown})=>createHash('sha256').update(JSON.stringify({description:w.description,images:w.images,imageCaptions:w.imageCaptions})).digest('hex');
try{
 const plan=JSON.parse(await readFile('seed-data/cirsureas-study.json','utf8'));
 if(plan.sourceKey!=='/project-cirsureas-app/')throw Error('Cirsureas source key required');
 const patch={description:JSON.stringify(validateBlocks(JSON.parse(plan.patch.description))),images:plan.patch.images as string[],imageCaptions:plan.patch.imageCaptions as string[]};
 if(JSON.stringify(descriptionImages(patch.description))!==JSON.stringify(patch.images)||patch.images.length!==27||patch.imageCaptions.length!==27)throw Error('Expected twenty-seven reviewed image/text pairs');
 for(const src of patch.images)await access(path.join('public',src));
 const seedText=await readFile('seed-data/content.json','utf8');const seed=JSON.parse(seedText);
 const seedWork=seed.works.find((w:{sourceKey:string})=>w.sourceKey===plan.sourceKey);
 if(!seedWork)throw Error('Missing first-install content');
 const current=await db.work.findUniqueOrThrow({where:{sourceKey:plan.sourceKey}});
 const changed=hash(current)!==hash(patch);
 if(changed){
  if(hash(current)!==plan.expectedHash)throw Error('Cirsureas content edited; review before applying this upgrade');
  await mkdir('data/content-backups',{recursive:true});
  await writeFile(`data/content-backups/cirsureas-${Date.now()}.json`,JSON.stringify(current,null,2),{flag:'wx'});
  const result=await db.work.updateMany({where:{id:current.id,updatedAt:current.updatedAt},data:patch});
  if(result.count!==1)throw Error('Concurrent Cirsureas edit; no changes applied');
 }
 Object.assign(seedWork,patch);const next=JSON.stringify(seed,null,2);
 if(seedText!==next){
  if(await readFile('seed-data/content.json','utf8')!==seedText)throw Error('Seed changed concurrently; review and rerun');
  const temp=`seed-data/cirsureas-${Date.now()}.tmp`;await writeFile(temp,next,{flag:'wx'});await rename(temp,'seed-data/content.json');
 }
 console.log(`Cirsureas study: ${changed?1:0} record changed; metadata preserved; first-install content synchronized.`);
}finally{await db.$disconnect();}
