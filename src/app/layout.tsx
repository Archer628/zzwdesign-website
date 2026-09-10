import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL('https://zzwdesign.cn'),title:{default:'ZZWDESIGN — 邹智文 / UI·UX 设计师',template:'%s — ZZWDESIGN'},description:'邹智文的设计作品集，专注于创造简洁、高效、美观的数字产品体验。'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="zh-CN"><head><link rel="preload" href="/fonts/nunito-sans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="license" href="/fonts/NOTICE.txt"/></head><body>{children}</body></html>;}
