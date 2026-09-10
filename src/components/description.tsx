import type { ReactNode } from 'react';
import { blocks, type Block } from '@/lib/content';
import { MediaImage } from './media-image';

function emphasis(text:string,branded:boolean) {
 if(!branded)return text;
 return text.split(/(五步核心骨架|流程简洁|大字体、高对比度|积分即时可视|高效完成结算|折扣来源与金额|无需额外点击|主要操作区|支付引导|可读性与折扣效率)/g).map((part,i)=>i%2?<strong className="case-emphasis" key={i}>{part}</strong>:part);
}
function Figure({block,branded=false}:{block:Extract<Block,{type:'image'}>;branded?:boolean}) {
 return <figure className={`case-figure case-figure-${block.layout}`}>
  <a href={block.src} target="_blank" rel="noreferrer" className="case-image-link" title="打开原图" aria-label={`查看原图：${block.text}`}><MediaImage src={block.src} alt={block.text}/></a>
  {(block.text||block.detail)&&<figcaption><h3>{block.text}</h3>{block.detail&&<p>{emphasis(block.detail,branded)}</p>}</figcaption>}
 </figure>;
}
function body(items:Block[],branded=false,study=false,refined=false) {
 const result:ReactNode[]=[];
 for(let i=0;i<items.length;i++){
  const b=items[i];
  if(b.type==='image'&&b.layout==='card'){
   const cards=[b];
   while(items[i+1]?.type==='image'&&(items[i+1] as Extract<Block,{type:'image'}>).layout==='card')cards.push(items[++i] as Extract<Block,{type:'image'}>);
   result.push(<div className="case-image-grid" key={i}>{cards.map((card,j)=><Figure block={card} branded={branded} key={j}/>)}</div>);
  }else if(b.type==='image')result.push(<Figure block={b} branded={branded} key={i}/>);
  else if(b.type==='table'){
   const [head,...rows]=b.text.split('\n').map(r=>r.split('|').map(c=>c.trim()));
   result.push(<div className="case-table-wrap" key={i}><table className="case-table"><thead><tr>{head.map((c,j)=><th scope="col" key={j}>{c}</th>)}</tr></thead><tbody>{rows.map((r,j)=><tr key={j}>{r.map((c,k)=>k===0?<th scope="row" key={k}>{c}</th>:<td data-label={head[k]} key={k}>{emphasis(c,branded)}</td>)}</tr>)}</tbody></table></div>);
  }else if(b.type==='heading')result.push(<h2 key={i}>{b.text}</h2>);
  else if(b.type==='ul'||b.type==='ol'){const Tag=b.type;result.push(<Tag className={refined?(b.type==='ol'?'case-route':'case-notes'):study?(b.type==='ol'?'study-diagram':'study-decisions'):branded?(b.type==='ol'?'checkout-route':'checkout-notes'):undefined} key={i}>{b.text.split('\n').map((t,j)=>{const colon=study||branded||refined?t.indexOf('：'):-1;return <li key={j}>{colon>0?<><strong className="case-fact-label">{t.slice(0,colon)}</strong><span>{t.slice(colon+1)}</span></>:emphasis(t,branded)}</li>;})}</Tag>);}
  else result.push(<p key={i}>{emphasis(b.text,branded)}</p>);
 }
 return result;
}
export function Description({value,branded=false,editorial=false,study=false,medical=false,refined=false}:{value:string;branded?:boolean;editorial?:boolean;study?:boolean;medical?:boolean;refined?:boolean}) {
 const content=blocks(value);
 if(!content.some(b=>b.type==='image'))return <div className="description">{body(content)}</div>;
 const sections:Block[][]=[];
 for(const block of content){if(block.type==='heading'||!sections.length)sections.push([]);sections[sections.length-1].push(block);}
 return <div className="description case-story">{sections.map((section,i)=>{
  if(!branded&&!editorial)return <section className="case-section" key={i}>{body(section)}</section>;
  const heading=section[0]?.type==='heading'?section[0]:null;
  const content=heading?section.slice(1):section;
  const topicEnd=heading?.text.indexOf('：')??-1;
  const layout=editorial?(content.some(b=>b.type==='image'&&b.layout==='card')?'screens':content.some(b=>b.type==='image')?'showcase':'brief'):content.some(b=>b.type==='ol')?'steps':content.some(b=>b.type==='ul')?'brief':content.filter(b=>b.type==='image'&&b.layout==='wide').length>1?'flow':'standard';
  const studyLayout=content.some(b=>b.type==='image')?'screens':content.some(b=>b.type==='table')?'matrix':content.some(b=>b.type==='ol')?'map':'essay';
  const wide=content.filter(b=>b.type==='image'&&b.layout==='wide').length, cards=content.filter(b=>b.type==='image'&&b.layout==='card').length;
  const checkoutLayout=i===0?'opening':wide===1&&cards===1?'pair':cards?'gallery':'essay';
  return <section className={`case-section case-section-${layout}${study?` study-${studyLayout}`:''}${branded?` checkout-${checkoutLayout}`:''}${medical&&i===0?' medical-opening':''}`} id={study?`study-section-${i}`:undefined} tabIndex={study?-1:undefined} key={i}>{heading&&<header className="case-section-heading"><h2>{topicEnd>0?<><span className="case-title-context">{heading.text.slice(0,topicEnd+1)}</span>{heading.text.slice(topicEnd+1)}</>:heading.text}</h2></header>}<div className="case-section-content">{body(content,branded,study,refined)}</div></section>;
 })}</div>;
}
