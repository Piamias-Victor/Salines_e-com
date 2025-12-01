const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Available models:');
console.log(Object.getOwnPropertyNames(prisma)
    .filter(k => !k.startsWith('_') && !k.startsWith('$'))
    .sort()
    .join('\n'));
