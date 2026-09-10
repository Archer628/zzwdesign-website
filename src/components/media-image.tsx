'use client';
import { useState } from 'react';
export function MediaImage({src,alt,loading='lazy',className=''}:{src:string;alt:string;loading?:'lazy'|'eager';className?:string}) {
 const [failed,setFailed]=useState(false);
 return !src||failed?<div className={`image-unavailable ${className}`} role="img" aria-label={alt}>{alt}<span>图片暂不可用</span></div>:<img className={className} src={src} alt={alt} loading={loading} decoding="async" onError={()=>setFailed(true)}/>;
}
