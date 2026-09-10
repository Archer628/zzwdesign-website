import Link from 'next/link';
import { thumbnail, type WorkView } from '@/lib/content';
import { MediaImage } from './media-image';
export function Arrow({diagonal=false}:{diagonal?:boolean}) { return <svg className="remix-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false"><use href={`/icons/remix/sprite.svg#${diagonal?'arrow-right-up-line':'arrow-right-line'}`}/></svg>; }
export function Header(){return <header className="site-header"><Link className="site-logo" href="/" aria-label="Z-DESIGN 首页">Z-DESIGN</Link></header>;}
export function BackToTop(){return <a className="back-to-top" href="#site-top" aria-label="返回顶部" title="返回顶部"><Arrow/></a>;}
export function Footer(){return <footer className="site-footer"><span>© {new Date().getFullYear()} ZZWDESIGN</span><a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">粤ICP备2026070725号-1</a><BackToTop/></footer>;}
export function WorkCard({work,priority=false,duplicate=false,showYear=true}:{work:WorkView;priority?:boolean;duplicate?:boolean;showYear?:boolean}) {return <Link className="work-card" href={`/works/${work.slug}`} tabIndex={duplicate?-1:undefined}><div className="card-media"><MediaImage src={thumbnail(work.cover)} alt={work.title} loading={priority?'eager':'lazy'}/></div><div className="card-copy"><div className="card-meta"><span>{work.tags.slice(0,2).join(' / ')}</span>{showYear&&<span>{work.year}</span>}</div><h3>{work.title}</h3><p>{work.summary}</p></div></Link>;}
export { Description } from './description';
