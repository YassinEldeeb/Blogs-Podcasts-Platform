import { RedisPubSub } from 'graphql-redis-subscriptions'
import { PubSub } from 'graphql-subscriptions'
import path from 'path'
import { buildSchema } from 'type-graphql'
import { authSubscription } from '../middleware/AuthSubscription'

export const createSchema = (pubSub: PubSub | RedisPubSub) =>
  buildSchema({
    resolvers: [path.join(__dirname, '../resolvers/**/*.{ts,js}')],
    pubSub,
    authChecker: authSubscription,
  })
