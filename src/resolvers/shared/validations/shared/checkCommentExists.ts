import { prisma } from '../../../../prisma'

export const checkCommentExistance = (id: string) => {
  return prisma.comment
    .findFirst({
      where: { id, post: { published: true } },
    })
    .then((comment) => {
      console.log(comment)
      if (comment) return true
      return false
    })
}
