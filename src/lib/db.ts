import { PrismaClient } from '@prisma/client';
const globalDb = globalThis as unknown as {zzwDb?: PrismaClient};
export const db = globalDb.zzwDb ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalDb.zzwDb = db;
