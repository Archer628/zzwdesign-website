import Link from 'next/link';
import { Login } from '@/components/admin';
export const metadata={title:'后台登录',robots:{index:false,follow:false}};
export default function Page(){return <main className="login-page"><div className="login-card"><Link href="/" className="wordmark">ZZW®</Link><h1>欢迎回来<span className="green-period">.</span></h1><p>登录 ZZWDESIGN 管理后台</p><Login/></div></main>;}
