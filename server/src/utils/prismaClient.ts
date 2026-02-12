//build prisma client for using it in all controllers
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

export default prisma;