import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import {saveUpload,uploads} from '../src/lib/media';
test('animated GIF, MP4 and WebM processing preserve formats',async()=>{
 const before=new Set(await readdir(uploads));const created=new Set<string>();
 try{
  for(const name of ['qa-animation.gif','qa-video.mp4','qa-video.webm']){
   const data=await readFile(path.resolve('tests/fixtures',name));
   const stored=await saveUpload(new File([new Uint8Array(data)],name));created.add(path.basename(stored));
   if(name.endsWith('.gif')){
    created.add(path.basename(stored.replace('-1600','-800')));
    const meta=await sharp(await readFile(path.join(uploads,path.basename(stored))),{animated:true}).metadata();
    assert.equal(meta.format,'webp');assert.equal(meta.pages,4);assert.equal(meta.width,64);
   }else assert.equal(createHash('sha256').update(await readFile(path.join(uploads,path.basename(stored)))).digest('hex'),createHash('sha256').update(data).digest('hex'));
  }
  await assert.rejects(()=>saveUpload(new File([Buffer.from('not mp4')],'wrong.mp4')));
  await assert.rejects(()=>saveUpload(new File([Buffer.from('<svg/>')],'wrong.svg')));
  await assert.rejects(()=>saveUpload(new File([Buffer.alloc(10*1024*1024+1)],'huge.png')));
 }finally{for(const name of created)if(!before.has(name))await unlink(path.join(uploads,name));}
});
