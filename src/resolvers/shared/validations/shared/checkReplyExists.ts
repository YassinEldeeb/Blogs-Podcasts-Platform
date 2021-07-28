import { prisma } from '@/prisma'

export const checkReplyExistance = (id: string) => {
  return prisma.reply
    .findFirst({
      where: { id },
    })
    .then((reply) => {
      if (reply) return true
      return false
    })
}
