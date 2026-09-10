import {PrismaClient} from '@prisma/client';
import {readFile,mkdir,writeFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {validateBlocks} from '../src/lib/validation';
import {descriptionImages} from '../src/lib/content';

// Explicit one-case content upgrade; ordinary seed never overwrites existing edits.
const db=new PrismaClient();
try{
 const seed=JSON.parse(await readFile('seed-data/content.json','utf8')).works.find((w:{sourceKey:string})=>w.sourceKey==='/project-michaels-self-checkout/');
 const current=await db.work.findUniqueOrThrow({where:{sourceKey:seed.sourceKey}});
 const description=JSON.stringify(validateBlocks(JSON.parse(seed.description)));
 const patch={description,images:seed.images,imageCaptions:seed.imageCaptions};
 if(current.description===description&&JSON.stringify(current.images)===JSON.stringify(patch.images)&&JSON.stringify(current.imageCaptions)===JSON.stringify(patch.imageCaptions)){
  console.log('Already arranged; no records changed.');
 }else{
  const expected='eef45baa6e160e881c8542ddd0a16b177090f7386871d12a41abfb2acddf2c7b';
  if(createHash('sha256').update(JSON.stringify({description:current.description,images:current.images,imageCaptions:current.imageCaptions})).digest('hex')!==expected)throw Error('Existing description was edited. Review it before applying this content upgrade.');
  for(const src of descriptionImages(description))await access(path.join('public',src));
  await mkdir('data/content-backups',{recursive:true});
  await writeFile(`data/content-backups/michaels-${Date.now()}.json`,JSON.stringify(current,null,2),{flag:'wx'});
  const changed=await db.work.updateMany({where:{id:current.id,updatedAt:current.updatedAt},data:patch});
  if(changed.count!==1)throw Error('Record changed concurrently; no content overwritten.');
  console.log('Michaels Self Checkout arranged; one record updated, original saved in data/content-backups.');
 }
}finally{await db.$disconnect();}
