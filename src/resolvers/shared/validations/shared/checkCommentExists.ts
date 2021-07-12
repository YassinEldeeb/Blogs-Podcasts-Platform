import { prisma } from '../../../../prisma'

export const checkCommentExistance = (id: string) => {
  return prisma.comment
    .findUnique({
      where: { id },
      select: {
        id: true,
      },
    })
    .then((comment) => {
      if (comment) return true
      return false
    })
}
