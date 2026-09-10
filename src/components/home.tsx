'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { WorkCard, Arrow } from './site';
import type { WorkView } from '@/lib/content';

function Column({items,staggered=false}:{items:WorkView[];staggered?:boolean}) {
 const track=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const element=track.current;
  if(!element)return;
  const region=element.closest('.waterfall')!;
  let animation:Animation|undefined,frame=0,last=0,rate=0,impulse=0;
  function measure(){
   const progress=animation?Number(animation.currentTime||0)/Number(animation.effect?.getTiming().duration||1)%1:0;
   animation?.cancel();
   animation=undefined;
   const height=element!.firstElementChild!.getBoundingClientRect().height;
   const group=element!.firstElementChild!;
   const offset=staggered?(group.firstElementChild!.getBoundingClientRect().height+parseFloat(getComputedStyle(group).rowGap))/2:0;
   animation=element!.animate([{transform:`translateY(${-height-offset}px)`},{transform:`translateY(${-offset}px)`}],{duration:height/28*1000,iterations:Infinity,easing:'linear'});
   // Keep one full cycle in reserve so reverse input never reaches the start boundary.
   animation.currentTime=(1+progress)*height/28*1000;
   animation.playbackRate=rate;
  }
  function tick(now:number){
   const dt=Math.min((now-(last||now))/1000,.05);last=now;
   const stopped=document.hidden;
   impulse*=Math.exp(-dt/.8);
   rate+=((stopped?0:1+impulse)-rate)*(1-Math.exp(-dt/.18));
   if(animation){
    const duration=Number(animation.effect!.getTiming().duration);
    const time=Number(animation.currentTime||0);
    if(time<duration||time>=duration*2){animation.currentTime=duration+((time%duration)+duration)%duration;if(animation.playState==='finished')animation.play();}
    animation.updatePlaybackRate(Math.abs(rate)<.001?0:rate);
   }
   frame=requestAnimationFrame(tick);
  }
  function wheel(event:Event){
   const e=event as WheelEvent;
   if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
   e.preventDefault();
   const pixels=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?region.clientHeight:1);
   impulse=Math.max(-12,Math.min(12,impulse+pixels/75));
  }
  region.addEventListener('wheel',wheel,{passive:false});
  const resize=new ResizeObserver(measure);resize.observe(element.firstElementChild!);
  measure();
  frame=requestAnimationFrame(tick);
  return()=>{region.removeEventListener('wheel',wheel);resize.disconnect();cancelAnimationFrame(frame);animation?.cancel();};
 },[items.length,staggered]);
 const repeated=items.length?Array.from({length:Math.ceil(6/items.length)*items.length},(_,i)=>items[i%items.length]):[];
 // All copies need the same intrinsic image heights before a loop can join cleanly.
 return <div className={`waterfall-column ${staggered?'staggered':''}`}><div className="waterfall-track" ref={track}>{[0,1,2].map(copy=><div className="waterfall-group" key={copy} aria-hidden={copy!==1?true:undefined}>{repeated.map((w,i)=><WorkCard key={`${copy}-${i}`} work={w} duplicate={copy!==1} priority/>)}</div>)}</div></div>;
}

function HomeCursor(){
 const cursor=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const layer=cursor.current!,shell=layer.closest('.site-shell')!;
  const dot=layer.firstElementChild as HTMLElement;
  const fluid=layer.querySelector('path')!;
  const trails=Array.from({length:7},()=>({x:0,y:0}));
  const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
  let x=0,y=0,frame=0,last=0,size=12,sizeAnimation:Animation|undefined;
  function hide(){shell.removeAttribute('data-home-cursor');fluid.removeAttribute('d');cancelAnimationFrame(frame);frame=0;sizeAnimation?.cancel();size=12;dot.style.width=dot.style.height='12px';}
  function resizeDot(target:EventTarget|null){
   const link=(target as Element|null)?.closest('a[href],button:not(:disabled),[role="button"]');
   const next=link&&link.getAttribute('aria-disabled')!=='true'?20:12;
   if(next===size)return;
   const current=getComputedStyle(dot).width;
   sizeAnimation?.cancel();size=next;
   dot.style.width=dot.style.height=`${size}px`;
   sizeAnimation=dot.animate([{width:current,height:current},{width:`${size}px`,height:`${size}px`}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'});
  }
  function tick(now:number){
   const dt=Math.min(last?(now-last)/1000:1/60,1/30);last=now;
   let leaderX=x,leaderY=y,moving=false;
   trails.forEach((trail,i)=>{
    let dx=leaderX-trail.x,dy=leaderY-trail.y;
    const distance=Math.hypot(dx,dy);
    if(distance>18){trail.x=leaderX-dx/distance*18;trail.y=leaderY-dy/distance*18;dx=leaderX-trail.x;dy=leaderY-trail.y;}
    const ease=1-Math.exp(-dt/(.04+i*.006));
    trail.x+=dx*ease;trail.y+=dy*ease;
    if(Math.hypot(x-trail.x,y-trail.y)>.15)moving=true;
    leaderX=trail.x;leaderY=trail.y;
   });
   if(moving){
    // One filled, tapered outline follows the lagging spine, not repeated cursor copies.
    const spine=[{x,y},...trails];
    const length=spine.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-spine[i].x,p.y-spine[i].y),0);
    const radius=parseFloat(getComputedStyle(dot).width)/2*Math.min(1,length/24)*.9;
    const sides=[1,-1].map(side=>spine.map((p,i)=>{
     const previous=spine[Math.max(0,i-1)],next=spine[Math.min(spine.length-1,i+1)];
     const dx=next.x-previous.x,dy=next.y-previous.y,normal=Math.hypot(dx,dy)||1;
     const width=radius*Math.pow(1-i/(spine.length-1),1.35)*side;
     return {x:p.x-dy/normal*width,y:p.y+dx/normal*width};
    }));
    fluid.setAttribute('d',outline(sides[0],'M')+outline(sides[1].reverse(),'L')+'Z');
   }else fluid.removeAttribute('d');
   frame=moving?requestAnimationFrame(tick):0;
  }
  function outline(points:{x:number;y:number}[],start:'M'|'L'){
   let path=`${start}${points[0].x},${points[0].y}`;
   for(let i=1;i<points.length-1;i++){
    const point=points[i],next=points[i+1];
    path+=`Q${point.x},${point.y} ${(point.x+next.x)/2},${(point.y+next.y)/2}`;
   }
   const end=points[points.length-1];
   return path+`L${end.x},${end.y}`;
  }
  function move(event:Event){
   const e=event as PointerEvent;
   if(!fine.matches||e.pointerType!=='mouse'){hide();return;}
   x=e.clientX;y=e.clientY;
   if(!shell.hasAttribute('data-home-cursor')){trails.forEach(trail=>{trail.x=x;trail.y=y;});fluid.removeAttribute('d');}
   dot.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
   shell.setAttribute('data-home-cursor','');
   resizeDot(e.target);
   if(!frame){last=0;frame=requestAnimationFrame(tick);}
  }
  function keyboard(e:KeyboardEvent){if(e.key==='Tab')hide();}
  shell.addEventListener('pointermove',move);
  shell.addEventListener('pointerover',move);
  shell.addEventListener('pointerleave',hide);
  fine.addEventListener('change',hide);
  window.addEventListener('blur',hide);
  window.addEventListener('keydown',keyboard);
  return()=>{hide();shell.removeEventListener('pointermove',move);shell.removeEventListener('pointerover',move);shell.removeEventListener('pointerleave',hide);fine.removeEventListener('change',hide);window.removeEventListener('blur',hide);window.removeEventListener('keydown',keyboard);};
 },[]);
 return <div className="home-cursor" ref={cursor} aria-hidden="true"><i className="home-cursor-dot"/><svg className="home-cursor-fluid" width="100%" height="100%" focusable="false"><path/></svg></div>;
}

export function Home({works,settings}:{works:WorkView[];settings:Record<string,string>}) {
 const title=useRef<HTMLHeadingElement>(null);
 const [singleColumn,setSingleColumn]=useState(false);
 useEffect(()=>{
  const heading=title.current;
  if(!heading)return;
  const intro=heading.closest('.home-intro')!;
  const letters=Array.from(heading.querySelectorAll<HTMLElement>('.hero-glyph-slot')).map(slot=>({slot,glyph:slot.firstElementChild as HTMLElement,position:[0,0,0],velocity:[0,0,0],target:[0,0,0]}));
  const buttons=Array.from(intro.querySelectorAll<HTMLElement>('.intro-actions .button'));
  const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  // Play once on entry; glyph motion stays on an independent child transform.
  const entrance=Array.from(intro.querySelectorAll<HTMLElement>('.hero-title-line,.subtitle,.intro-actions')).map((element,i)=>element.animate([
   {opacity:0,transform:`translateY(${reduced.matches?14:30}px)`},
   {opacity:1,transform:'translateY(0)'},
  ],{duration:reduced.matches?650:950,delay:i*110,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
  let frame=0,last=0;
  function tick(now:number){
   const dt=Math.min(last?(now-last)/1000:1/60,1/30);last=now;
   let moving=false;
   for(const letter of letters){
    const returning=letter.target.every(value=>value===0);
    for(let axis=0;axis<3;axis++){
     const distance=letter.target[axis]-letter.position[axis];
     letter.velocity[axis]+=(distance*(returning?110:240)-letter.velocity[axis]*(returning?(reduced.matches?22:16):(reduced.matches?32:22)))*dt;
     letter.position[axis]+=letter.velocity[axis]*dt;
     if(Math.abs(distance)>.01||Math.abs(letter.velocity[axis])>.05)moving=true;
     else{letter.position[axis]=letter.target[axis];letter.velocity[axis]=0;}
    }
    const [x,y,rotation]=letter.position;
    letter.glyph.style.transform=`translate3d(${x}px,${y}px,0) rotate(${rotation}deg)`;
   }
   frame=moving?requestAnimationFrame(tick):0;
  }
  function wake(){if(!frame){last=0;frame=requestAnimationFrame(tick);}}
  function reset(){
   letters.forEach(letter=>{letter.target=[0,0,0];});
   wake();
   buttons.forEach(button=>{button.style.removeProperty('--arrow-x');button.style.removeProperty('--arrow-y');});
  }
  function move(event:Event){
   const e=event as PointerEvent;
   if(!fine.matches||e.pointerType!=='mouse'){reset();return;}
   for(const letter of letters){
    // Measure the stationary slot so moving glyphs never feed back into hit testing.
    const box=letter.slot.getBoundingClientRect();
    const dx=box.left+box.width/2-e.clientX,dy=box.top+box.height/2-e.clientY;
    const distance=Math.hypot(dx,dy),radius=box.height*1.7;
    const force=Math.pow(Math.max(0,1-distance/radius),2)*(reduced.matches?.6:1);
    letter.target=[dx/Math.max(distance,20)*16*force,dy/Math.max(distance,20)*16*force,dx/radius*12*force];
   }
   wake();
   buttons.forEach(button=>{
    const bounds=button.getBoundingClientRect();
    const over=e.clientX>=bounds.left&&e.clientX<=bounds.right&&e.clientY>=bounds.top&&e.clientY<=bounds.bottom;
    button.style.setProperty('--arrow-x',over?`${(e.clientX-bounds.left-bounds.width/2)/bounds.width*6}px`:'0px');
    button.style.setProperty('--arrow-y',over?`${(e.clientY-bounds.top-bounds.height/2)/bounds.height*6}px`:'0px');
   });
  }
  intro.addEventListener('pointermove',move);
  intro.addEventListener('pointerleave',reset);
  fine.addEventListener('change',reset);
  window.addEventListener('resize',reset);
  window.addEventListener('blur',reset);
  return()=>{intro.removeEventListener('pointermove',move);intro.removeEventListener('pointerleave',reset);fine.removeEventListener('change',reset);window.removeEventListener('resize',reset);window.removeEventListener('blur',reset);cancelAnimationFrame(frame);entrance.forEach(animation=>animation.cancel());};
 },[settings.title]);
 useEffect(()=>{
  const query=window.matchMedia('(max-width: 600px)');
  const update=()=>setSingleColumn(query.matches);
  update();query.addEventListener('change',update);
  return()=>query.removeEventListener('change',update);
 },[]);
 const columns=singleColumn?[works]:[works.filter((_,i)=>i%2===0),works.filter((_,i)=>i%2===1)];
 if(columns.length===2&&!columns[1].length)columns[1]=columns[0];
 return <main className="home-layout">
  <HomeCursor/>
  <section className="home-intro"><div className="intro-bottom">
   <h1 className="hero-elastic-title" ref={title} aria-label={settings.title.replaceAll('\n',' ')}>{settings.title.split('\n').map((line,i)=><span className="hero-title-line" aria-hidden="true" key={i}>{Array.from(line).map((letter,j)=><span className="hero-glyph-slot" key={j}><span className="hero-glyph">{letter}</span></span>)}</span>)}</h1>
   <p className="subtitle">{settings.subtitle}</p>
   <div className="intro-actions"><Link className="button primary" href="/works">{settings.worksLabel}<Arrow/></Link><Link className="button" href="/about">{settings.aboutLabel}<Arrow diagonal/></Link></div>
  </div></section>
  <section className="waterfall" aria-label="精选作品">
   {works.length?columns.map((col,i)=><Column key={i} items={col} staggered={i===1}/>):<p className="empty">作品整理中，敬请期待。</p>}
   <div className="waterfall-fade waterfall-fade-top" aria-hidden="true"><i/><i/><i/></div>
   <div className="waterfall-fade waterfall-fade-bottom" aria-hidden="true"><i/><i/><i/></div>
  </section>
 </main>;
}
