import { PrismaClient } from '@prisma/client'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { Request, Response } from 'express'
import { postsLoader } from '@/data-loaders/PostsLoader'
import { commentsLoader } from 'src/data-loaders/CommentsLoader'
import { followersLoader } from 'src/data-loaders/FollowersLoader'
import { followingLoader } from 'src/data-loaders/FollowingLoader'

interface MyContext {
  prisma: PrismaClient
  pubsub: RedisPubSub
  req: Request
  res: Response
  wsHeaders: any
  userId?: string
  postsLoader: ReturnType<typeof postsLoader>
  commentsLoader: ReturnType<typeof commentsLoader>
  followersLoader: ReturnType<typeof followersLoader>
  followingLoader: ReturnType<typeof followingLoader>
}

export { MyContext }
