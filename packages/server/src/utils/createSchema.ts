import { RedisPubSub } from 'graphql-redis-subscriptions'
import { PubSub } from 'graphql-subscriptions'
import path from 'path'
import { buildSchema } from 'type-graphql'
import { authSubscription } from '@middleware/AuthSubscription'
import { GraphQLSchema } from 'graphql'

export const createSchema = (
  pubSub: PubSub | RedisPubSub,
): Promise<GraphQLSchema> =>
  buildSchema({
    resolvers: [path.join(__dirname, '../resolvers/**/*.{ts,js}')],
    pubSub,
    authChecker: authSubscription,
  })
