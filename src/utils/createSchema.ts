import { buildSchema } from 'type-graphql'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import path from 'path'

export const createSchema = (pubSub: RedisPubSub) =>
  buildSchema({
    resolvers: [path.join(__dirname, '../resolvers/**/*.{ts,js}')],
    pubSub,
  })
