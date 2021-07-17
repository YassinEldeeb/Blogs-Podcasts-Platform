import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { RedisPubSub } from 'graphql-redis-subscriptions'
// import { PubSub } from 'graphql-subscriptions'
import { prisma } from './prisma'
import { createSchema } from './utils/createSchema'
import expressPlayground from 'graphql-playground-middleware-express'
import cookieParser from 'cookie-parser'
import { refreshTokenRouter } from './auth/routes/expressRefreshToken'
import { postsLoader } from './data-loaders/PostsLoader'

const pubsub = new RedisPubSub()

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
  })

  await server.start()

  const app = express()
  app.use(cookieParser())
  app.use(refreshTokenRouter)

  app.get('/', expressPlayground({ endpoint: '/graphql' }))

  server.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log(`
      Server is running!
      Listening on port 4000
      Explore at https://studio.apollographql.com/sandbox
    `)
  })
})()
