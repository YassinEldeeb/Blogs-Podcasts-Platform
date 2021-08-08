import { Follower } from '@/models/Follower'
import { prisma } from '@/prisma'
import { Prisma } from '@prisma/client'
import DataLoader from 'dataloader'

interface data {
  id: string
  select: any
  args: any
  userId: string
  followed_userId: string
}

const batchData: any = async (data: data[]) => {
  const ids = data.map((e) => e.id)
  const followingIds = (
    await prisma.follower.findMany({
      where: { follower_userId: data[0].userId },
      select: { followed_userId: true },
    })
  ).map((e: { followed_userId: string }) => e.followed_userId)

  const uniqueId = 'followed_userId'
  const select = data[0].select
  const args = data[0].args

  select[uniqueId] = true

  const where: Prisma.FollowerWhereInput = {
    follower_userId: { in: followingIds },
    followed_userId: { in: ids },
  }

  const records = await prisma.follower.findMany({
    where,
    cursor: args.cursorId ? { id: args.cursorId } : undefined,
    take: args.take,
    skip: args.skip,
    orderBy: args.orderBy,
    select,
  })

  const dataMap: any = []

  records.forEach((post: any) => {
    if (dataMap[post[uniqueId]]) {
      dataMap[post[uniqueId]].push(post)
    } else {
      dataMap[post[uniqueId]] = [post]
    }
  })

  const result = ids.map((e: any) => dataMap[e] || [])

  while (data.length !== result.length && data.length > 0) {
    result.push([])
  }

  return result
}

const followedByLoader = (() => new DataLoader<data, Follower[]>(batchData))()

export { followedByLoader }
