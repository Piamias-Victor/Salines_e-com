import { PrismaClient } from '../apps/web/node_modules/.prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating admin user...');

    const email = 'admin@salines.fr';
    const password = 'Admin123!'; // Change this!
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Admin',
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true,
        },
    });

    console.log('✅ Admin user created!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('⚠️  Please change the password after first login!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
