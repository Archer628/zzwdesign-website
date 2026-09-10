import {notFound} from 'next/navigation';
import {requireAdmin} from '@/lib/auth';
export default async function Page(){await requireAdmin();notFound();}
