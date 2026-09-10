import { notFound } from 'next/navigation';
import Link from 'next/link';
import { works } from '@/lib/data';
import { descriptionImages,isRefinedStudy } from '@/lib/content';
import { Description,Arrow } from '@/components/site';
import { MediaImage } from '@/components/media-image';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const w=(await works()).find(w=>w.slug===slug);return {title:w?.title||'作品未找到'};}
export default async function Page({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const items=await works();const index=items.findIndex(w=>w.slug===slug);if(index<0)notFound();const w=items[index];
 const inline=descriptionImages(w.description);
 const refined=isRefinedStudy(w.sourceKey);
 const branded=w.sourceKey==='/project-michaels-self-checkout/';
 const editorial=inline.length>0&&!branded;
 const study=['/project-apricot-app/','/project-cirsureas-app/','/project-brandslink-wms/','/project-oms/'].includes(w.sourceKey||'');
 return <main className={`page detail${refined?' detail-refined':''}${inline.length?' detail-editorial detail-case':''}${branded?' detail-michaels':''}${editorial?' detail-series':''}${study?(w.sourceKey==='/project-cirsureas-app/'?' detail-cirsureas':w.sourceKey==='/project-apricot-app/'?' detail-apricot':' detail-study'):''}`} data-case={w.sourceKey?.replace(/^\/project-|\/$/g,'')}>
  <Link className="back-link" href="/works">全部案例 <Arrow/></Link>
  <div className="detail-lead"><MediaImage src={w.cover} alt={w.title} loading="eager" className="detail-cover"/><header className="detail-heading"><h1>{w.title}</h1><p className="detail-summary">{w.summary}</p><p className="eyeline">{w.tags.join(' / ')} <span>{w.year}</span></p></header></div>
  <Description value={w.description} refined={refined} branded={branded} editorial={editorial} study={study} medical={w.sourceKey==='/project-apricot-medical-assistant-system/'}/>
  {w.link&&<a className="button" href={w.link} target="_blank" rel="noreferrer">访问项目<Arrow diagonal/></a>}
  {w.images.some(src=>!inline.includes(src))&&<div className="gallery">{w.images.map((src,i)=>!inline.includes(src)&&<figure key={`${src}-${i}`}><MediaImage src={src} alt={w.imageCaptions[i]||`${w.title} · ${i+1}`}/>{w.imageCaptions[i]&&<figcaption>{w.imageCaptions[i]}</figcaption>}</figure>)}</div>}
  <nav className="next-works" aria-label="上下篇作品">{index>0?<Link href={`/works/${items[index-1].slug}`}><small>上一篇</small>{items[index-1].title}</Link>:<span/>}{index<items.length-1&&<Link href={`/works/${items[index+1].slug}`}><small>下一篇</small>{items[index+1].title}<Arrow/></Link>}</nav>
 </main>;
}
