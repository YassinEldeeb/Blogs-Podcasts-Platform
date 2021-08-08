import { prisma } from '@/prisma'
import { Prisma } from '@prisma/client'

export const checkCommentExistance = (id: string, postId?: string) => {
  const where: Prisma.CommentWhereInput = { id }
  if (postId) where.postId = postId

  return prisma.comment
    .findFirst({
      where,
    })
    .then((comment) => {
      if (comment) return true
      return false
    })
}
