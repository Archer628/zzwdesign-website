import {PrismaClient} from '@prisma/client';
import {copyFile,readFile,mkdir,unlink,writeFile} from 'node:fs/promises';
import {parseEnv} from 'node:util';
import {randomUUID,createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';
await mkdir('evidence',{recursive:true});
const testFile=path.resolve('evidence','qa-seed-'+randomUUID()+'.db');
// Called only while application is not running; copy is disposable, source is never edited.
await copyFile('data/app.db',testFile);
const url='file:'+testFile.replaceAll('\\','/');const db=new PrismaClient({datasourceUrl:url});
try{
 const works=await db.work.findMany();assert.equal(works.length,9);assert.equal(works.filter(w=>w.published).length,9);for(const work of works){assert.ok(work.title.trim().length>0,`Missing title: ${work.slug}`);assert.ok(!work.summary.startsWith('Project –'),`Incorrect summary: ${work.slug}`);}
 const w=works[0];await db.work.update({where:{id:w.id},data:{title:'QA edited title',slug:'qa-edited-slug',summary:'QA edited summary'}});
 await db.setting.update({where:{key:'subtitle'},data:{value:'QA edited subtitle'}});
 const env={...process.env,...parseEnv(await readFile('.env','utf8')),DATABASE_URL:url};
 execFileSync(process.execPath,['node_modules/tsx/dist/cli.mjs','prisma/seed.ts'],{env,stdio:'pipe'});
 assert.equal(await db.work.count(),9);const preserved=await db.work.findUniqueOrThrow({where:{id:w.id}});assert.equal(preserved.title,'QA edited title');assert.equal(preserved.slug,'qa-edited-slug');assert.equal(preserved.summary,'QA edited summary');assert.equal((await db.setting.findUniqueOrThrow({where:{key:'subtitle'}})).value,'QA edited subtitle');
 const provenance=JSON.parse(await readFile('seed-data/provenance.json','utf8'));
 for(const p of provenance.projects){const md=await readFile(path.resolve('../zzwdesign-backup',p.source));assert.equal(createHash('sha256').update(md).digest('hex'),p.sourceSha256);}
 const result={status:'PASS',projects:9,published:9,sourceMarkdownHashesVerified:9,seedPreserves:['title','slug','summary','settings'],testDatabase:'isolated disposable copy',time:new Date().toISOString()};
 await writeFile('evidence/seed.json',JSON.stringify(result,null,2));console.log(result);
}finally{await db.$disconnect();await unlink(testFile);}
