import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'
import { RedisPubSub } from 'graphql-redis-subscriptions'
// import { PubSub } from 'graphql-subscriptions'
import { prisma } from './prisma'
import { createSchema } from './utils/createSchema'

const pubsub = new RedisPubSub()

const main = async () => {
  const schema = await createSchema(pubsub)

  const server = new ApolloServer({
    schema,
    context: {
      prisma,
      pubsub,
    },
  })

  server.listen().then(() => {
    console.log(`
    Server is running!
    Listening on port 4000
    Explore at https://studio.apollographql.com/sandbox
  `)
  })
}

main()
