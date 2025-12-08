import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔐 Creating admin account...');

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    // Create or update admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@salines.fr' },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            emailVerified: true,
            isActive: true,
        },
        create: {
            email: 'admin@salines.fr',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'Salines',
            role: 'ADMIN',
            emailVerified: true,
            isActive: true,
            newsletter: false,
        },
    });

    console.log('✅ Admin account created/updated:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: Admin123!`);
    console.log(`   Role: ${admin.role}`);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
