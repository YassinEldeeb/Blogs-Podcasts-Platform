import { Comment } from '@/models/Comment'
import { prisma } from '@/prisma'
import { Prisma } from '@prisma/client'
import DataLoader from 'dataloader'

interface data {
  id: string
  select: any
  args: any
  by: 'authorId' | 'postId'
}

const batchComments: any = async (data: data[]) => {
  const ids = data.map((e) => e.id)
  const select = data[0].select
  select[data[0].by] = true

  const where: Prisma.CommentWhereInput = {}

  where[data[0].by] = { in: ids }

  const comments = (await prisma.comment.findMany({
    where,
    cursor: data[0].args.cursorId ? { id: data[0].args.cursorId } : undefined,
    take: data[0].args.take,
    skip: data[0].args.skip,
    orderBy: data[0].args.orderBy,
    select,
  })) as Comment[]

  const commentsMap: any = []

  comments.forEach((comment: Comment) => {
    if (commentsMap[comment[data[0].by]]) {
      commentsMap[comment[data[0].by]].push(comment)
    } else {
      commentsMap[comment[data[0].by]] = [comment]
    }
  })

  return ids.map((e: any) => commentsMap[e] || [])
}

export const commentsLoader = () => new DataLoader<data, Comment>(batchComments)
