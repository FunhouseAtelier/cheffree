import logger from '@funhouse-atelier/logger'
import { PrismaClient } from '@prisma/client'

const log = logger({ name: '@/app/services/prisma.server.ts', level: 2 })
log.debug('logger instantiated')

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
