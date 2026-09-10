import {PrismaClient} from '@prisma/client';
import {readFile,writeFile,mkdir,access,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {validateBlocks} from '../src/lib/validation';
import {descriptionImages} from '../src/lib/content';
const db=new PrismaClient();
const hash=(w:{description:string;images:unknown;imageCaptions:unknown})=>createHash('sha256').update(JSON.stringify({description:w.description,images:w.images,imageCaptions:w.imageCaptions})).digest('hex');
try{
 const plan=JSON.parse(await readFile('seed-data/apricot-medical-study.json','utf8'));
 if(plan.sourceKey!=='/project-apricot-medical-assistant-system/')throw Error('Only Apricot Medical may be updated');
 const patch={description:JSON.stringify(validateBlocks(JSON.parse(plan.patch.description))),images:plan.patch.images as string[],imageCaptions:plan.patch.imageCaptions as string[]};
 const sources=JSON.parse(await readFile('seed-data/apricot-medical-sources.json','utf8'));
 if(JSON.stringify(descriptionImages(patch.description))!==JSON.stringify(patch.images)||JSON.stringify(sources.map((s:{src:string})=>s.src))!==JSON.stringify(patch.images)||patch.imageCaptions.length!==patch.images.length)throw Error('Reviewed image mapping mismatch');
 for(const src of patch.images)await access('public'+src);
 const current=await db.work.findUniqueOrThrow({where:{sourceKey:plan.sourceKey}});
 const changed=hash(current)!==hash(patch);
 if(changed&&hash(current)!==plan.expectedHash)throw Error('Apricot Medical content edited; review before applying upgrade');
 const seedText=await readFile('seed-data/content.json','utf8'),seed=JSON.parse(seedText);
 const seedWork=seed.works.find((w:{sourceKey:string})=>w.sourceKey===plan.sourceKey);
 if(!seedWork)throw Error('Missing first-install record');
 Object.assign(seedWork,patch);
 if(changed){
  await mkdir('data/content-backups',{recursive:true});
  await writeFile(`data/content-backups/apricot-medical-study-${Date.now()}.json`,JSON.stringify(current,null,2),{flag:'wx'});
  const result=await db.work.updateMany({where:{id:current.id,updatedAt:current.updatedAt},data:patch});
  if(result.count!==1)throw Error('Concurrent edit; update refused');
 }
 const next=JSON.stringify(seed,null,2);
 if(seedText!==next){
  if(await readFile('seed-data/content.json','utf8')!==seedText)throw Error('Seed changed concurrently; database preserved, review seed and rerun');
  const temp=`seed-data/apricot-medical-study-${Date.now()}.tmp`;await writeFile(temp,next,{flag:'wx'});await rename(temp,'seed-data/content.json');
 }
 console.log(`Apricot Medical study: ${changed?1:0} records changed; first-install content synchronized.`);
}finally{await db.$disconnect();}
