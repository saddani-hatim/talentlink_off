import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

console.log('Prisma keys:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
process.exit(0);
