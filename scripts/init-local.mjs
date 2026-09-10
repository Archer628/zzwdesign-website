import {randomBytes} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('data',{recursive:true});
await writeFile('.env',[
 'DATABASE_URL="file:../data/app.db"',
 'ADMIN_USER="zzw-admin"',
 `ADMIN_PASSWORD="${randomBytes(24).toString('base64url')}"`,
 `SESSION_SECRET="${randomBytes(32).toString('hex')}"`,
 'APP_ORIGIN="http://127.0.0.1:33100"',''
].join('\n'),{flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e;});
console.log('Local environment ready. Credentials kept only in .env.');
