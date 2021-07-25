import { Comment } from '@/models/Comment'
import { prisma } from '@/prisma'
import DataLoader from 'dataloader'

interface data {
  id: string
  select: any
  args: any
}

const batchComments: any = async (data: data[]) => {
  const ids = data.map((e) => e.id)
  const select = data[0].select
  select.authorId = true

  const comments = (await prisma.comment.findMany({
    where: { authorId: { in: ids } },
    cursor: data[0].args.cursorId ? { id: data[0].args.cursorId } : undefined,
    take: data[0].args.take,
    skip: data[0].args.skip,
    orderBy: data[0].args.orderBy,
    select,
  })) as Comment[]

  const commentsMap: any = []

  comments.forEach((comment: Comment) => {
    if (commentsMap[comment.authorId]) {
      commentsMap[comment.authorId].push(comment)
    } else {
      commentsMap[comment.authorId] = [comment]
    }
  })

  return ids.map((e: any) => commentsMap[e] || [])
}

export const commentsLoader = () => new DataLoader<data, Comment>(batchComments)
