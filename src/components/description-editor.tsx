'use client';
import { useState, useRef, type Dispatch, type SetStateAction } from 'react';
import { isRefinedStudy, thumbnail, type Block } from '@/lib/content';
import { Description } from './description';

const labels:Record<Block['type'],string>={heading:'章节标题',paragraph:'正文段落',image:'图片与说明',ol:'流程 / 有序列表',ul:'要点列表',table:'对照表格'};
function createBlock(type:Block['type']):Block {
 if(type==='image')return {type,text:'',src:'',layout:'wide',detail:''};
 return {type,text:type==='table'?'项目 | 说明\n内容 | 内容':''};
}

// Keep the established plain-text storage format; the editor supplies the structure.
function ListEditor({text,onChange}:{text:string;onChange:(text:string)=>void}) {
 const rows=text.split('\n');
 const update=(i:number,value:string)=>onChange(rows.map((r,j)=>i===j?value:r).join('\n'));
 return <div className="editor-nodes">{rows.map((row,i)=>{
  const at=row.indexOf('：'),title=at<0?row:row.slice(0,at),detail=at<0?'':row.slice(at+1);
  return <div className="editor-node" key={i}><span className="editor-number">{String(i+1).padStart(2,'0')}</span><div>
   <label className="field">节点 {i+1} 标题<input value={title} onChange={e=>update(i,e.target.value+(detail?'：'+detail:''))}/></label>
   <label className="field">节点 {i+1} 说明（可选）<textarea rows={2} value={detail} onChange={e=>update(i,title+(e.target.value?'：'+e.target.value.replace(/\r?\n/g,' '):''))}/></label>
   <div className="editor-actions"><button type="button" disabled={i===0} onClick={()=>{const next=[...rows];[next[i-1],next[i]]=[next[i],next[i-1]];onChange(next.join('\n'));}}>节点上移</button><button type="button" disabled={i===rows.length-1} onClick={()=>{const next=[...rows];[next[i+1],next[i]]=[next[i],next[i+1]];onChange(next.join('\n'));}}>节点下移</button><button type="button" disabled={rows.length===1} onClick={()=>onChange(rows.filter((_,j)=>j!==i).join('\n'))}>删除节点</button></div>
  </div></div>;
 })}<button className="button" type="button" onClick={()=>onChange(text+'\n')}>添加节点</button></div>;
}

function TableEditor({text,onChange}:{text:string;onChange:(text:string)=>void}) {
 const rows=text.split('\n').map(r=>r.split('|'));
 const cols=rows[0].length;
 const save=(next:string[][])=>onChange(next.map(r=>r.join('|')).join('\n'));
 return <><p className="editor-hint">第一行是表头。支持 2–6 列、2–30 行；每格填写内容，竖线请使用全角「｜」。</p><div className="editor-table-scroll"><table className="editor-table"><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}><label><span>{i===0?'表头':`第 ${i} 行`} · 第 {j+1} 列</span><textarea required rows={3} value={cell} onChange={e=>{e.target.setCustomValidity(e.target.value.includes('|')?'请使用全角竖线｜':'');save(rows.map((r,k)=>k===i?r.map((c,l)=>l===j?e.target.value.replace(/\r?\n/g,' '):c):r));}}/></label></td>)}<td>{i>0&&<button type="button" disabled={rows.length<=2} onClick={()=>save(rows.filter((_,j)=>j!==i))}>删除第 {i} 行</button>}</td></tr>)}</tbody></table></div><div className="editor-actions">
  <button type="button" disabled={rows.length>=30} onClick={()=>save([...rows,Array(cols).fill('')])}>添加行</button><button type="button" disabled={cols>=6} onClick={()=>save(rows.map(r=>[...r,'']))}>添加列</button>{rows[0].map((_,j)=><button type="button" key={j} disabled={cols<=2} onClick={()=>save(rows.map(r=>r.filter((_,k)=>k!==j)))}>删除第 {j+1} 列</button>)}
 </div></>;
}

export function DescriptionEditor({value,onChange,images,sourceKey,upload}:{value:Block[];onChange:Dispatch<SetStateAction<Block[]>>;images:string[];sourceKey?:string|null;upload:(onFiles:(paths:string[])=>void)=>React.ReactNode}) {
 const [ids,setIds]=useState(()=>value.map((_,i)=>`initial-${i}`));
 const currentIds=useRef(ids);currentIds.current=ids;
 const [newType,setNewType]=useState<Block['type']>('paragraph');
 const [preview,setPreview]=useState(false);
 const update=(id:string,block:Block)=>onChange(value.map((b,i)=>ids[i]===id?block:b));
 function insert(at:number){const next=[...value],keys=[...ids];next.splice(at,0,createBlock(newType));keys.splice(at,0,crypto.randomUUID());setIds(keys);onChange(next);}
 function move(from:number,to:number){const next=[...value],keys=[...ids];[next[from],next[to]]=[next[to],next[from]];[keys[from],keys[to]]=[keys[to],keys[from]];setIds(keys);onChange(next);}
 const refined=isRefinedStudy(sourceKey);
 const branded=sourceKey==='/project-michaels-self-checkout/',study=['/project-apricot-app/','/project-cirsureas-app/','/project-brandslink-wms/','/project-oms/'].includes(sourceKey||'');
 const media=[...new Set([...images,...value.flatMap(b=>b.type==='image'&&b.src?[b.src]:[])])];
 return <div className="detail-editor">
  <p className="editor-hint">按章节组织正文、图文、流程与表格。展开区块即可编辑；修改在点击「保存作品」后生效。</p>
  <div className="editor-toolbar"><strong>{value.length} 个区块</strong><div className="editor-actions"><button type="button" aria-pressed={!preview} onClick={()=>setPreview(false)}>编辑内容</button><button type="button" aria-pressed={preview} onClick={()=>setPreview(true)}>预览排版</button></div></div>
  {preview?<><p className="editor-hint">当前未保存内容的正文预览，沿用本项目版式。完整页面可在保存后查看。</p><div className={`editor-preview detail detail-case detail-editorial${refined?' detail-refined':''}${branded?' detail-michaels':' detail-series'}${study?(sourceKey==='/project-cirsureas-app/'?' detail-cirsureas':sourceKey==='/project-apricot-app/'?' detail-apricot':' detail-study'):''}`} data-case={sourceKey?.replace(/^\/project-|\/$/g,'')}><Description value={JSON.stringify(value)} refined={refined} branded={branded} editorial={!branded} study={study} medical={sourceKey==='/project-apricot-medical-assistant-system/'}/></div></>:<>
   <div className="editor-insert"><label>新增内容类型<select value={newType} onChange={e=>setNewType(e.target.value as Block['type'])}>{Object.entries(labels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><button type="button" className="button" disabled={value.length>=300} onClick={()=>insert(0)}>在开头插入</button><button type="button" className="button" disabled={value.length>=300} onClick={()=>insert(value.length)}>在末尾添加</button></div>
   {!value.length&&<p className="empty">尚无详情内容，选择内容类型后添加第一个区块。</p>}
   {value.map((b,i)=><details className="editor-block" key={ids[i]} open={ids[i].startsWith('initial-')?undefined:true}>
    <summary><span className="editor-number">{String(i+1).padStart(2,'0')}</span><span><small>{labels[b.type]}</small><strong>{b.text.split('\n')[0].slice(0,64)||'未填写内容'}</strong></span>{b.type==='image'&&b.src&&<img src={thumbnail(b.src)} alt=""/>}</summary>
    <div className="editor-block-body"><div className="editor-actions"><button type="button" disabled={i===0} onClick={()=>move(i,i-1)}>区块上移</button><button type="button" disabled={i===value.length-1} onClick={()=>move(i,i+1)}>区块下移</button><button type="button" disabled={value.length>=300} onClick={()=>insert(i+1)}>在此后插入{labels[newType]}</button><button type="button" className="danger" onClick={()=>{if(confirm('移除此区块？保存作品后生效，原始媒体文件会保留。')){setIds(ids.filter((_,j)=>j!==i));onChange(value.filter((_,j)=>j!==i));}}}>移除区块</button></div>
     {b.type==='table'?<TableEditor text={b.text} onChange={text=>update(ids[i],{...b,text})}/>:b.type==='ol'||b.type==='ul'?<ListEditor text={b.text} onChange={text=>update(ids[i],{...b,text})}/>:<label className="field">{b.type==='image'?'图片标题':b.type==='heading'?'章节标题':'正文内容'}<textarea aria-label={`第 ${i+1} 个区块内容`} value={b.text} onChange={e=>update(ids[i],{...b,text:e.target.value})}/></label>}
     {b.type==='image'&&<><label className="field">图文版式<select value={b.layout} onChange={e=>update(ids[i],{...b,layout:e.target.value as 'wide'|'card'})}><option value="wide">全宽图片</option><option value="card">并排图文（相邻区块自动分组）</option></select></label>{b.src&&<img className="media-preview" src={thumbnail(b.src)} alt={b.text||'当前区块图片'}/>}<label className="field">对应说明<textarea value={b.detail} onChange={e=>update(ids[i],{...b,detail:e.target.value})}/></label>
      <details className="editor-media"><summary>从本项目媒体选择（{media.length} 张）</summary><div className="editor-media-grid">{media.map((src,j)=><button type="button" key={src} aria-pressed={b.src===src} aria-label={`选择图片 ${j+1}`} onClick={()=>update(ids[i],{...b,src})}><img src={thumbnail(src)} alt="" loading="lazy"/><span>图片 {j+1}</span></button>)}</div>{!media.length&&<p>暂无图片，请上传。</p>}</details>
      {upload(paths=>{if(paths[0])onChange(current=>current.map((item,j)=>currentIds.current[j]===ids[i]&&item.type==='image'?{...item,src:paths[0]}:item));})}<p className="editor-hint">更换图片保留本区块标题与说明；不会删除原文件。</p></>}
    </div>
   </details>)}
  </>}
 </div>;
}

