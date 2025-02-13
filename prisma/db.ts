import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => new PrismaClient()

declare const globalThis: {
  prismaGlobal: PrismaClient | undefined
} & typeof global

export const getPrismaClient = () => {
  if (process.env.NODE_ENV === 'production') {
    return prismaClientSingleton()
  }
  globalThis.prismaGlobal ||= prismaClientSingleton()
  return globalThis.prismaGlobal
}

const prisma = getPrismaClient()
export default prisma
