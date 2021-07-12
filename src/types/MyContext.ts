import { PrismaClient } from '@prisma/client'
import { RedisPubSub } from 'graphql-redis-subscriptions'

interface MyContext {
  prisma: PrismaClient
  pubsub: RedisPubSub
}

export { MyContext }
