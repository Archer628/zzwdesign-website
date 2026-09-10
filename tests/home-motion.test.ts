import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

// The latest requirement keeps the visible homepage moving, including focused cards.
test('waterfall auto-scrolls, eases wheel direction, wraps cycles and cleans up',()=>{
 const source=readFileSync(new URL('../src/components/home.tsx',import.meta.url),'utf8');
 const compiled=ts.transpileModule(source.replace('function Column(','export function Column('),{
  compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS},
 }).outputText;
 let cleanup=()=>{},frame=(_now:number)=>{void _now;};
 const listeners:Record<string,(e:object)=>void>={};
 let animations=0,cancellations=0,prevented=0,focused=false,now=1000;
 const documentState={hidden:false};
 const animation={currentTime:0,playbackRate:0,effect:{getTiming:()=>({duration:60000})},
  updatePlaybackRate:(rate:number)=>{animation.playbackRate=rate;},cancel:()=>{cancellations++;}};
 const region={matches:()=>focused,clientHeight:600,addEventListener:(name:string,fn:(e:object)=>void)=>{listeners[name]=fn;},removeEventListener:(name:string)=>{delete listeners[name];}};
 const group={getBoundingClientRect:()=>({height:1680})};
 const element={closest:()=>region,firstElementChild:group,animate:()=>{animations++;return animation;}};
 const exports:Record<string,(p:object)=>void>={};
 runInNewContext(compiled,{
  exports,React:{createElement:()=>null},document:documentState,window:{matchMedia:()=>({matches:true})},
  requestAnimationFrame:(fn:typeof frame)=>{frame=fn;return 1;},cancelAnimationFrame:()=>{},
  ResizeObserver:class{observe(){} disconnect(){}},
  require:(name:string)=>name==='react'?{useRef:()=>({current:element}),useEffect:(fn:()=>()=>void)=>{cleanup=fn();}}:{},
 });
 exports.Column({items:[]});
 const advance=(count:number)=>{for(let i=0;i<count;i++){frame(now);now+=50;}};
 const scroll=(deltaY:number,ctrlKey=false)=>listeners.wheel({ctrlKey,deltaX:0,deltaY,deltaMode:0,preventDefault:()=>{prevented++;}});
 assert.equal(animations,1);
 advance(40);assert.ok(animation.playbackRate>.99,'automatically moves down');
 scroll(1200);advance(5);assert.ok(animation.playbackRate>1,'wheel down accelerates');
 scroll(-2400);advance(8);assert.ok(animation.playbackRate<0,'wheel up reverses with easing');
 advance(180);assert.ok(Math.abs(animation.playbackRate-1)<.01,'returns to cruising speed');
 scroll(100,true);assert.equal(prevented,2,'Ctrl-wheel remains native');
 animation.currentTime=-5;advance(1);assert.ok(animation.currentTime>=60000&&animation.currentTime<120000);
 animation.currentTime=180005;advance(1);assert.ok(animation.currentTime>=60000&&animation.currentTime<120000);
 focused=true;advance(40);assert.ok(animation.playbackRate>.99,'card focus must not stop scrolling');
 scroll(-2400);advance(8);assert.ok(animation.playbackRate<0,'wheel still reverses with a card focused');
 assert.equal(prevented,3);
 documentState.hidden=true;advance(40);assert.equal(animation.playbackRate,0,'hidden page can conserve resources');
 documentState.hidden=false;advance(180);assert.ok(Math.abs(animation.playbackRate-1)<.01,'visible page resumes');
 const touch=(type:string,x:number,y:number,count=1)=>{
  let blocked=false;
  assert.ok(listeners[type],`${type} is handled`);
  listeners[type]({touches:Array.from({length:count},()=>({clientX:x,clientY:y})),cancelable:true,preventDefault:()=>{blocked=true;}});
  return blocked;
 };
 animation.currentTime=90000;
 touch('touchstart',100,300);
 const start=animation.currentTime;
 assert.equal(touch('touchmove',101,180),true,'vertical swipe controls cards instead of page');
 assert.ok(Math.abs(animation.currentTime-start+120/28*1000)<.01,'up swipe tracks finger distance');
 advance(10);assert.equal(animation.playbackRate,0,'finger drag overrides cruising');
 touch('touchmove',100,260);assert.ok(Math.abs(animation.currentTime-start+40/28*1000)<.01,'down swipe reverses immediately');
 touch('touchend',0,0,0);advance(40);assert.ok(animation.playbackRate>.99,'release resumes auto-scroll');
 let clickBlocked=false;
 listeners.click({preventDefault:()=>{clickBlocked=true;},stopPropagation:()=>{}});
 assert.ok(clickBlocked,'swipe does not accidentally open a card');
 touch('touchstart',100,300);touch('touchend',100,300,0);
 clickBlocked=false;listeners.click({preventDefault:()=>{clickBlocked=true;},stopPropagation:()=>{}});
 assert.equal(clickBlocked,false,'fresh tap still opens a card');
 touch('touchstart',100,300);assert.equal(touch('touchmove',200,302),false,'horizontal gesture stays native');
 touch('touchstart',100,300);assert.equal(touch('touchmove',100,200,2),false,'pinch stays native');
 advance(40);assert.ok(animation.playbackRate>.99,'multi-touch does not leave animation paused');
 touch('touchstart',100,300);touch('touchmove',100,200);touch('touchcancel',0,0,0);
 advance(40);assert.ok(animation.playbackRate>.99,'cancel resumes auto-scroll');
 cleanup();assert.equal(cancellations,1);assert.deepEqual(Object.keys(listeners),[]);
});
