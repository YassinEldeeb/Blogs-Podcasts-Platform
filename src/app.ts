import path from 'path'
require('dotenv-safe').config({
  example: path.join(__dirname, '../config/.env.example'),
})
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { execute, subscribe } from 'graphql'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { graphqlUploadExpress } from 'graphql-upload'
import { createServer } from 'http'
import passport from 'passport'
import 'reflect-metadata'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { refreshTokenRouter } from './auth/routes/expressRefreshToken'
import { githubOAuthRouter } from './OAuth/Github/routes/auth'
import { githubStrategyRouter } from './OAuth/Github/strategy'
import { prisma } from './prisma'
import { createSchema } from './utils/createSchema'

const pubsub = new RedisPubSub({ connection: { host: process.env.REDIS_HOST } })

;(async () => {
  const schema = await createSchema(pubsub)

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      prisma,
      pubsub,
      req,
      res,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  })

  await server.start()

  const app = express()

  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
      credentials: true,
    })
  )
  app.set('trust proxy', 1)

  app.use(cookieParser())
  app.use(refreshTokenRouter)
  app.use(graphqlUploadExpress())
  app.use(
    '/profile_images',
    express.static(path.join(__dirname, '../uploads/profile_images/'))
  )
  app.use(
    '/posts_images',
    express.static(path.join(__dirname, '../uploads/posts_images/'))
  )

  server.applyMiddleware({ app })

  const httpServer = createServer(app)

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect(wsHeaders: any) {
        return { wsHeaders }
      },
    },
    { server: httpServer, path: server.graphqlPath }
  )

  app.use(githubStrategyRouter)
  app.use(passport.initialize())
  app.use(githubOAuthRouter)

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((user: any, done) => {
    done(null, user)
  })

  httpServer.listen(4000, () => {
    console.log(`
      Server is running!
      Listening on port 4000
      Explore on https://studio.apollographql.com/sandbox
    `)
  })
})()

export { pubsub }
