import { InputError } from './validation';
export async function limitedBody(request:Request,max:number){
 if(Number(request.headers.get('content-length')||0)>max)throw new InputError('请求内容超过大小限制');
 const reader=request.body?.getReader();if(!reader)return new Uint8Array();
 const chunks:Uint8Array[]=[];let size=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();throw new InputError('请求内容超过大小限制');}chunks.push(value);}}finally{reader.releaseLock();}
 const output=new Uint8Array(size);let offset=0;for(const chunk of chunks){output.set(chunk,offset);offset+=chunk.length;}return output;
}
export async function limitedJson(request:Request,max=1024*1024){const value=JSON.parse(new TextDecoder().decode(await limitedBody(request,max)));if(!value||Array.isArray(value)||typeof value!=='object')throw new InputError('请求必须是 JSON 对象');return value;}
export async function limitedForm(request:Request){const body=await limitedBody(request,11*1024*1024);return new Response(body,{headers:{'Content-Type':request.headers.get('content-type')||''}}).formData();}
