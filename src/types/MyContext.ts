import { PrismaClient } from '@prisma/client'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { Request, Response } from 'express'

interface MyContext {
  prisma: PrismaClient
  pubsub: RedisPubSub
  req: Request
  res: Response
  userId?: string
}

export { MyContext }
