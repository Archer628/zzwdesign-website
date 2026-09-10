import { db } from './db';
import { defaults, stringArray, type WorkView } from './content';
export async function works():Promise<WorkView[]> {
  return (await db.work.findMany({where:{published:true},orderBy:[{order:'asc'},{id:'asc'}]})).map(w=>({...w,images:stringArray(w.images),tags:stringArray(w.tags),imageCaptions:stringArray(w.imageCaptions)}));
}
export async function settings() { return {...defaults,...Object.fromEntries((await db.setting.findMany()).map(s=>[s.key,s.value]))}; }
