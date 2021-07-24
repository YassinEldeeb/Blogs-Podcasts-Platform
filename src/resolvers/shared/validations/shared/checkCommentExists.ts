import { prisma } from '@/prisma'

export const checkCommentExistance = (id: string) => {
  return prisma.comment
    .findFirst({
      where: { id },
    })
    .then((comment) => {
      if (comment) return true
      return false
    })
}
