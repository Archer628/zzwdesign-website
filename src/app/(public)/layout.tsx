import { Header,Footer } from '@/components/site';
export default function PublicLayout({children}:{children:React.ReactNode}) {return <div className="site-shell" id="site-top"><Header/>{children}<Footer/></div>;}
