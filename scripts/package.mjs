import {readdir,stat,mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
// Explicit allowlist: credentials, live SQLite, uploads and dependencies are never packaged.
const roots=['src','prisma','scripts','deploy','tests','public/fonts','public/icons','seed-data/content.json','seed-data/provenance.json','seed-data/reflow-remaining.json','seed-data/apricot-study.json','seed-data/cirsureas-study.json','seed-data/cirsureas-sources.json','seed-data/warehouse-study.json','seed-data/warehouse-sources.json','seed-data/michaels-study.json','seed-data/michaels-study-sources.json','package.json','package-lock.json','tsconfig.json','next-env.d.ts','next.config.ts','postcss.config.mjs','eslint.config.mjs','.env.example','.gitignore','README.md','VERIFICATION.md','TASK_STATE.md','DESIGN_UPDATE.md','MICHAELS_REFLOW.md','REMAINING_CASES.md','APRICOT_STUDY.md','ADMIN_DETAIL_EDITOR.md','CIRSUREAS_STUDY.md','VISUAL_STANDARD.md','ABOUT_REDESIGN.md','WAREHOUSE_STUDY.md','MICHAELS_STUDY.md','APRICOT_MEDICAL_STUDY.md','seed-data/apricot-medical-study.json','seed-data/apricot-medical-sources.json'];
roots.push('seed-data/remaining-study.json','seed-data/remaining-study-sources.json','REMAINING_STUDIES.md');
async function walk(p){const s=await stat(p);if(s.isDirectory()){const children=[];for(const n of await readdir(p))children.push(...await walk(path.join(p,n)));return children;}return [p.replaceAll('\\','/')];}
await mkdir('dist',{recursive:true});const files=[];for(const root of roots)files.push(...await walk(root));
await writeFile('dist/source-files.txt',files.join('\n')+'\n');
execFileSync('tar',['-a','-cf','dist/zzwdesign-source.zip','-T','dist/source-files.txt']);
execFileSync('tar',['-a','-cf','dist/zzwdesign-initial-media.zip','seed-data/media']);
const hashes=[];for(const file of ['zzwdesign-source.zip','zzwdesign-initial-media.zip']){const b=await readFile('dist/'+file);hashes.push({file,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex')});}
await writeFile('dist/manifest.json',JSON.stringify(hashes,null,2));console.log(hashes);
