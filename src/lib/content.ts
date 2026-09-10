export type Block = {type:'paragraph'|'heading'|'ul'|'ol'|'table'; text:string} | {type:'image';text:string;src:string;layout:'wide'|'card';detail:string};
export function isRefinedStudy(sourceKey?:string|null):boolean { return ['/project-apricot-medical-assistant-system/','/project-apricot-app/','/project-cirsureas-app/','/project-brandslink-wms/','/project-oms/','/project-michaels-self-checkout/','/project-michaels-buyer-app/','/project-michaels-ops-management-system/','/project-michaels-official-website-new-platform/'].includes(sourceKey||''); }
export function descriptionImages(value:string):string[] { return blocks(value).flatMap(b=>b.type==='image'?[b.src]:[]); }
export type WorkView = {id:string;sourceKey?:string|null;title:string;slug:string;cover:string;images:string[];imageCaptions:string[];summary:string;description:string;tags:string[];year:string;link:string;order:number;published:boolean};
export const defaults: Record<string,string> = {title:'ZZW\nDESIGN',subtitle:'UI·UX DESIGNER / 作品集',worksLabel:'全部案例',aboutLabel:'关于我',mediaMode:'carousel',mediaPath:''};
export function stringArray(value: unknown): string[] { return Array.isArray(value) ? value.filter((v):v is string=>typeof v==='string') : []; }
export function blocks(value:string):Block[] { try { const v=JSON.parse(value); return Array.isArray(v)?v:[]; } catch { return []; } }
export function thumbnail(path:string) { return path.replace(/-1600\.webp$/, '-800.webp'); }
export function slugify(value:string) { return value.normalize('NFKC').trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'').slice(0,120); }
