import { SettingsForm } from '@/components/admin';
import { settings } from '@/lib/data';
import { requireAdmin } from '@/lib/auth';
export default async function Page(){await requireAdmin();return <><h1>首页配置</h1><SettingsForm initial={await settings()}/></>;}
