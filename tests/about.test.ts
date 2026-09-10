import test from 'node:test';
import assert from 'node:assert/strict';
import { aboutSections,experienceRows } from '../src/lib/about';
import type { Block } from '../src/lib/content';

const paragraph=(text:string):Block=>({type:'paragraph',text});
test('about layout groups existing content without discarding editable text or media',()=>{
 const value=[...['10年经验','UI/UX设计','产品设计','设计系统','个人介绍','Experience'].map(paragraph),{type:'heading',text:'工作经历'},...['2024.06 - 至今','UIUX设计师','公司一','完整职责一','2021.01 - 2024.03','UI设计师','公司二','完整职责二','Contact'].map(paragraph),{type:'heading',text:'联系我'},paragraph('designer@example.com')];
 const result=aboutSections(JSON.stringify(value));
 assert.deepEqual(result.skills.map(b=>b.text),['10年经验','UI/UX设计','产品设计','设计系统']);
 assert.deepEqual(result.intro,[paragraph('个人介绍')]);
 assert.deepEqual(result.sections.map(s=>[s.title,s.kicker]),[['工作经历','Experience'],['联系我','Contact']]);
 const rows=experienceRows(result.sections[0].content)!;
 assert.equal(rows.length,2);
 assert.deepEqual(rows.flatMap(r=>[r.date,r.role,r.company,...r.description.map(b=>b.text)]),result.sections[0].content.map(b=>b.text));
 assert.equal(result.sections[1].content[0].text,'designer@example.com');
 const image:Block={type:'image',src:'/uploads/portrait.webp',text:'新增图片',detail:'说明',layout:'wide'};
 assert.deepEqual(aboutSections(JSON.stringify([image])).intro,[image]);
 assert.equal(experienceRows([paragraph('自由编辑的履历')]),null);
 assert.equal(experienceRows([paragraph('2024.06 - 至今'),paragraph('未完整填写')]),null);
 assert.deepEqual(aboutSections('[]'),{intro:[],skills:[],sections:[]});
});
