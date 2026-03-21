import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123@', 10);

  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: { role: Role.ADMIN },
    create: {
      email: 'admin@gmail.com',
      fullname: 'System Admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
