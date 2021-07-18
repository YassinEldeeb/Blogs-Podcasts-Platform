import { PrismaClient } from '@prisma/client'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { Request, Response } from 'express'
import { postsLoader } from '../data-loaders/PostsLoader'

interface MyContext {
  prisma: PrismaClient
  pubsub: RedisPubSub
  req: Request
  res: Response
  wsHeaders: any
  userId?: string
  postsLoader: ReturnType<typeof postsLoader>
}

export { MyContext }
