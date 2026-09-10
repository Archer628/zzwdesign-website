import { createHmac,randomBytes,timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export const COOKIE='zzw_session';
const WEEK=7*24*60*60;
function config(){const {ADMIN_USER:user,ADMIN_PASSWORD:password,SESSION_SECRET:secret}=process.env;if(!user||!password||!secret||secret.length<32||password.startsWith('CHANGE_ME')||secret.startsWith('GENERATE_'))throw new Error('请先配置独立管理员账号、密码和 SESSION_SECRET');return {user,password,secret};}
function equal(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}
function signature(data:string){const {secret,password}=config();return createHmac('sha256',secret).update(data+'|'+password).digest('base64url');}
export function credentials(user:string,password:string){const c=config();return equal(user,c.user)&&equal(password,c.password);}
export function token(){const value=Buffer.from(JSON.stringify({user:config().user,exp:Math.floor(Date.now()/1000)+WEEK,nonce:randomBytes(16).toString('hex')})).toString('base64url');return `${value}.${signature(value)}`;}
export function validToken(value:string){try {const [data,sig,...extra]=value.split('.');if(extra.length||!data||!sig||!equal(signature(data),sig))return false;const body=JSON.parse(Buffer.from(data,'base64url').toString());return body.user===config().user&&Number.isInteger(body.exp)&&body.exp>Math.floor(Date.now()/1000)&&body.exp<=Math.floor(Date.now()/1000)+WEEK;}catch{return false;}}
export async function authenticated(){return validToken((await cookies()).get(COOKIE)?.value||'');}
export async function requireAdmin(){if(!await authenticated())redirect('/admin/login');}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');return Boolean(origin&&process.env.APP_ORIGIN&&origin===new URL(process.env.APP_ORIGIN).origin);}
export const cookieOptions={httpOnly:true,sameSite:'strict' as const,secure:process.env.NODE_ENV==='production',path:'/',maxAge:WEEK};
// One administrator and one PM2 process; a global credential throttle cannot be bypassed by a forged proxy IP.
const throttle=globalThis as unknown as {zzwAttempts?:{count:number;until:number}};
export function loginAllowed(){const now=Date.now();if(!throttle.zzwAttempts||now>throttle.zzwAttempts.until)throttle.zzwAttempts={count:0,until:now+15*60*1000};return throttle.zzwAttempts.count<10;}
export function failedLogin(){if(throttle.zzwAttempts)throttle.zzwAttempts.count++;}
export function successfulLogin(){throttle.zzwAttempts=undefined;}
