import { PrismaClient } from "@prisma/client";
const globalAny: any = global;
export const db = globalAny.db || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalAny.db = db;