import { blocks, type Block } from './content';

export function aboutSections(value:string) {
 const intro:Block[]=[];
 const sections:{title:string;kicker:string;content:Block[]}[]=[];
 for(const block of blocks(value)){
  const current=sections.length?sections[sections.length-1].content:intro;
  if(block.type!=='heading'){current.push(block);continue;}
  const last=current.at(-1);
  const kicker=last?.type==='paragraph'&&['Experience','Contact'].includes(last.text)?current.pop()!.text:'';
  sections.push({title:block.text,kicker,content:[]});
 }
 const skills=intro.length>=4&&intro.slice(0,4).every(b=>b.type==='paragraph')&&/^\d+年经验$/.test(intro[0].text)?intro.splice(0,4):[];
 return {intro,skills,sections};
}

export function experienceRows(content:Block[]) {
 const groups:Block[][]=[];
 for(const block of content){
  if(block.type==='paragraph'&&/^\d{4}[./]\d{1,2}\s*[-–—]\s*(至今|\d{4}[./]\d{1,2})$/.test(block.text))groups.push([]);
  if(!groups.length)return null;
  groups[groups.length-1].push(block);
 }
 if(!groups.length||groups.some(g=>g.length<4||g.slice(0,3).some(b=>b.type!=='paragraph')))return null;
 return groups.map(([date,role,company,...description])=>({date:date.text,role:role.text,company:company.text,description}));
}
