import { works,settings } from '@/lib/data';
import { Home } from '@/components/home';
export const dynamic='force-dynamic';
export default async function Page(){const [items,config]=await Promise.all([works(),settings()]);return <Home works={items} settings={config}/>;}
