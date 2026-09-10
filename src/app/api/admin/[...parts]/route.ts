import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { limitedJson,limitedForm } from '@/lib/request-body';
import { authenticated,sameOrigin,credentials,token,COOKIE,cookieOptions,loginAllowed,failedLogin,successfulLogin } from '@/lib/auth';
import { validateWork,validateSettings,InputError } from '@/lib/validation';
import { descriptionImages } from '@/lib/content';
import { saveUpload,assertMediaExists } from '@/lib/media';
export const runtime='nodejs';
const json=(v:unknown,status=200)=>NextResponse.json(v,{status,headers:{'Cache-Control':'no-store'}});
async function handle(request:Request,{params}:{params:Promise<{parts:string[]}>}){const {parts}=await params;const route=parts.join('/');const method=request.method;
 try {
  if(method!=='GET'&&!sameOrigin(request))return json({error:'请求来源不匹配'},403);
  if(route==='login'&&method==='POST'){if(!loginAllowed())return json({error:'尝试过于频繁，请 15 分钟后再试'},429);if(Number(request.headers.get('content-length')||0)>10000)return json({error:'请求过大'},413);const b=await limitedJson(request);if(typeof b.user!=='string'||typeof b.password!=='string'||!credentials(b.user,b.password)){failedLogin();return json({error:'账号或密码错误'},401);}successfulLogin();const r=json({ok:true});r.cookies.set(COOKIE,token(),cookieOptions);return r;}
  if(!await authenticated())return json({error:'请先登录'},401);
  if(route==='logout'&&method==='POST'){const r=json({ok:true});r.cookies.set(COOKIE,'',{...cookieOptions,maxAge:0});return r;}
  if(route==='upload'&&method==='POST'){if(Number(request.headers.get('content-length')||0)>11*1024*1024)return json({error:'文件超过 10MB'},413);const form=await limitedForm(request);const file=form.get('file');if(!(file instanceof File))throw new InputError('请选择文件');return json({path:await saveUpload(file)});}
  if(route==='settings') {if(method==='GET')return json(Object.fromEntries((await db.setting.findMany()).map(s=>[s.key,s.value])));if(method==='PUT'){const value=validateSettings(await limitedJson(request));await assertMediaExists([value.mediaPath]);await db.$transaction(Object.entries(value).map(([key,v])=>db.setting.upsert({where:{key},update:{value:v},create:{key,value:v}})));revalidatePath('/');return json({ok:true});}}
  if(parts[0]==='works'&&parts.length<=2){const id=parts[1];if(method==='GET'){if(id){const w=await db.work.findUnique({where:{id}});return w?json(w):json({error:'作品不存在'},404);}const u=new URL(request.url);const page=Math.max(1,Math.min(100000,Number(u.searchParams.get('page'))||1));const q=(u.searchParams.get('q')||'').slice(0,200);const where=q?{OR:[{title:{contains:q}},{summary:{contains:q}}]}:{};const [items,total]=await Promise.all([db.work.findMany({where,orderBy:[{order:'asc'},{id:'asc'}],skip:(Math.floor(page)-1)*12,take:12}),db.work.count({where})]);return json({items,total,page:Math.floor(page)});}
   if(method==='POST'&&!id||method==='PUT'&&id){const value=validateWork(await limitedJson(request));await assertMediaExists([value.cover,...value.images,...descriptionImages(value.description)]);const previous=id?await db.work.findUnique({where:{id}}):null;if(id&&!previous)return json({error:'作品不存在'},404);const w=id?await db.work.update({where:{id},data:value}):await db.work.create({data:value});for(const p of ['/', '/works',`/works/${w.slug}`,...(previous?[`/works/${previous.slug}`]:[])])revalidatePath(p);return json(w,id?200:201);}
   if(method==='DELETE'&&id){const w=await db.work.delete({where:{id}});for(const p of ['/','/works',`/works/${w.slug}`])revalidatePath(p);return json({ok:true});}
  }
  return json({error:'接口不存在'},404);
 }catch(e){if(e instanceof InputError||e instanceof SyntaxError)return json({error:e.message},400);if(e instanceof Prisma.PrismaClientKnownRequestError){if(e.code==='P2002')return json({error:'URL 标识已存在'},409);if(e.code==='P2025')return json({error:'作品不存在'},404);}console.error('Admin operation failed',e instanceof Error?e.name:'unknown');return json({error:'操作失败，请检查配置或文件格式后重试'},500);}
}
export {handle as GET,handle as POST,handle as PUT,handle as DELETE};
