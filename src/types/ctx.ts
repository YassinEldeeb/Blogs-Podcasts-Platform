import { PrismaClient } from '@prisma/client'
import { RedisPubSub } from 'graphql-redis-subscriptions'

interface ctx {
  prisma: PrismaClient
  pubsub: RedisPubSub
}

export { ctx }
