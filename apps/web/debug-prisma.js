const path = require('path');
try {
    const prismaClientPath = require.resolve('@prisma/client');
    console.log('Resolved @prisma/client:', prismaClientPath);

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    console.log('PrismaClient keys:', Object.keys(prisma));
    console.log('PrismaClient prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(prisma)));

    // Check if brand getter exists
    const proto = Object.getPrototypeOf(prisma);
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'brand');
    console.log('Brand descriptor:', descriptor ? 'Exists' : 'Missing');

} catch (e) {
    console.error('Error:', e);
}
