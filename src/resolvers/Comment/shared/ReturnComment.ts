import { DELETED } from '../../../@types/enums/mutationType'
import { prisma } from '../../../prisma'
import { CommentPublishedData } from './CommentPublished'

export const ReturnComment = async (
  data: CommentPublishedData,
  select: any
) => {
  let comment = null

  if (data.mutation !== DELETED) {
    comment = (await prisma.comment.findUnique({
      where: { id: data.id },
      select,
    })) as any
  }

  return {
    mutation: data.mutation,
    data: comment,
    deletedCommentId: data.deleted ? data.id : undefined,
  }
}
