import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { Logout } from '@/components/admin';
export const dynamic='force-dynamic';
export const metadata={title:'管理后台',robots:{index:false,follow:false}};
export default async function Layout({children}:{children:React.ReactNode}){await requireAdmin();return <div className="admin-shell"><aside className="admin-nav"><Link className="wordmark" href="/">ZZW®</Link><Link href="/admin">概览</Link><Link href="/admin/works">作品管理</Link><Link href="/admin/settings">首页配置</Link><Link href="/">查看网站</Link><Logout/></aside><main className="admin-main">{children}</main></div>;}
