'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="page"><h1>暂时无法加载</h1><p>请稍后重试。</p><button className="button" onClick={reset}>重试</button></main>;}
