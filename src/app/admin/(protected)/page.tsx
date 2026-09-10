import Link from 'next/link';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
export default async function Page(){await requireAdmin();const [total,published]=await Promise.all([db.work.count(),db.work.count({where:{published:true}})]);return <><p className="eyeline">ZZWDESIGN / ADMIN</p><h1>让好作品，被看见。</h1><div className="stat-grid"><div className="stat"><strong>{total}</strong><span>全部作品</span></div><div className="stat"><strong>{published}</strong><span>已发布</span></div><div className="stat"><strong>{total-published}</strong><span>草稿</span></div></div><div className="dashboard-links"><Link className="button primary" href="/admin/works/new">新增作品</Link><Link className="button" href="/admin/settings">配置首页</Link></div></>;}
