import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = process.argv[2] || 'admin@patrimoine.ma';
  const password = process.argv[3] || 'admin1234';

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'admin',
      artisanStatus: 'approved',
      onboardingCompleted: true,
    },
    create: {
      email,
      fullName: 'System Administrator',
      phoneNumber: '0000000000',
      password: hashedPassword,
      role: 'admin',
      artisanStatus: 'approved',
      onboardingCompleted: true,
    },
  });

  console.log(`✅ Admin account configured:`);
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
