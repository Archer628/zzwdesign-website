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
 let cleanup=()=>{},wheel=(e:object)=>{void e;},frame=(_now:number)=>{void _now;};
 let animations=0,cancellations=0,prevented=0,focused=false,now=1000;
 const documentState={hidden:false};
 const animation={currentTime:0,playbackRate:0,effect:{getTiming:()=>({duration:60000})},
  updatePlaybackRate:(rate:number)=>{animation.playbackRate=rate;},cancel:()=>{cancellations++;}};
 const region={matches:()=>focused,clientHeight:600,addEventListener:(_n:string,fn:typeof wheel)=>{wheel=fn;},removeEventListener:()=>{}};
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
 const scroll=(deltaY:number,ctrlKey=false)=>wheel({ctrlKey,deltaX:0,deltaY,deltaMode:0,preventDefault:()=>{prevented++;}});
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
 cleanup();assert.equal(cancellations,1);
});
