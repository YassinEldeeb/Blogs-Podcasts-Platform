import Redis from 'ioredis'
import { RedisPubSub } from 'graphql-redis-subscriptions'

const redisClient = new Redis({ host: process.env.REDIS_HOST })
const pubsub = new RedisPubSub({ connection: { host: process.env.REDIS_HOST } })

redisClient.on('error', (error) => {
  console.error(error)
})

export { redisClient, pubsub }
