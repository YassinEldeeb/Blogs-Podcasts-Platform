import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { RedisPubSub } from 'graphql-redis-subscriptions'
// import { PubSub } from 'graphql-subscriptions'
import { prisma } from './prisma'
import { createSchema } from './utils/createSchema'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import cookieParser from 'cookie-parser'
import { refreshTokenRouter } from './auth/routes/expressRefreshToken'
import { postsLoader } from './data-loaders/PostsLoader'
import { createServer } from 'http'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import './redis'
import './emails/confirmEmail'

const pubsub = new RedisPubSub({})

;(async () => {
  const schema = await createSchema(pubsub)

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      prisma,
      pubsub,
      req,
      res,
      postsLoader: postsLoader(),
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  })

  await server.start()

  const app = express()
  app.use(cookieParser())
  app.use(refreshTokenRouter)

  server.applyMiddleware({ app })

  const httpServer = createServer(app)

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect(wsHeaders: any, ws: any) {
        return { wsHeaders }
      },
    },
    { server: httpServer, path: server.graphqlPath }
  )

  httpServer.listen(4000, () => {
    console.log(`
      Server is running!
      Listening on port 4000
      Explore at https://studio.apollographql.com/sandbox
    `)
  })
})()

export { pubsub }
