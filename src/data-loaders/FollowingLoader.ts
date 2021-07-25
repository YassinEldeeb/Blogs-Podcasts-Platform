import { Follower } from '@/models/Follower'
import { prisma } from '@/prisma'
import DataLoader from 'dataloader'

interface data {
  id: string
  select: any
  args: any
}

const batchFollowing: any = async (data: data[]) => {
  const ids = data.map((e) => e.id)
  const select = data[0].select
  select.follower_userId = true

  const followers = (await prisma.follower.findMany({
    where: { follower_userId: { in: ids } },
    cursor: data[0].args.cursorId ? { id: data[0].args.cursorId } : undefined,
    take: data[0].args.take,
    skip: data[0].args.skip,
    orderBy: data[0].args.orderBy,
    select,
  })) as Follower[]

  const followersMap: any = []

  followers.forEach((follower: Follower) => {
    if (followersMap[follower.follower_userId]) {
      followersMap[follower.follower_userId].push(follower)
    } else {
      followersMap[follower.follower_userId] = [follower]
    }
  })

  return ids.map((e: any) => followersMap[e] || [])
}

export const followingLoader = () =>
  new DataLoader<data, Follower>(batchFollowing)