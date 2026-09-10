import { works } from '@/lib/data';
import { WorkCard } from '@/components/site';
export const dynamic='force-dynamic';
export const metadata={title:'全部案例'};
export default async function Page(){const items=await works();return <main className="page"><div className="page-heading"><p className="eyeline">SELECTED WORK / {String(items.length).padStart(2,'0')}</p><h1>设计，让想法<br/>成为<span className="highlight">体验。</span></h1><p>从复杂业务到直觉体验，探索我的设计实践。</p></div><div className="works-grid">{items.map(w=><WorkCard key={w.id} work={w} showYear={false}/>)}</div>{!items.length&&<p className="empty">暂无已发布作品。</p>}</main>;}
