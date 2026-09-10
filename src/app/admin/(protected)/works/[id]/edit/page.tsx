import { notFound } from 'next/navigation';
import { WorkForm } from '@/components/admin';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { stringArray } from '@/lib/content';
export default async function Page({params}:{params:Promise<{id:string}>}){await requireAdmin();const {id}=await params;const w=await db.work.findUnique({where:{id}});if(!w)notFound();return <><h1>编辑作品</h1><WorkForm initial={{...w,images:stringArray(w.images),imageCaptions:stringArray(w.imageCaptions),tags:stringArray(w.tags)}}/></>;}
