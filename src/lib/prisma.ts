import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: any };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter: new PrismaPg({
            connectionString: process.env.DATABASE_URL,
        }),
        log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
