import { PrismaClient } from '@prisma/client'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { Request, Response } from 'express'
import { postsLoader } from '@/data-loaders/PostsLoader'
import { usersCommentsLoader } from '@/data-loaders/UsersCommentsLoader'
import { followersLoader } from 'src/data-loaders/FollowersLoader'
import { followingLoader } from 'src/data-loaders/FollowingLoader'
import { postsCommentsLoader } from '@/data-loaders/PostsCommentsLoader'

interface MyContext {
  prisma: PrismaClient
  pubsub: RedisPubSub
  req: Request
  res: Response
  wsHeaders: any
  userId?: string
  postsLoader: ReturnType<typeof postsLoader>
  usersCommentsLoader: ReturnType<typeof usersCommentsLoader>
  postsCommentsLoader: ReturnType<typeof postsCommentsLoader>
  followersLoader: ReturnType<typeof followersLoader>
  followingLoader: ReturnType<typeof followingLoader>
}

export { MyContext }
