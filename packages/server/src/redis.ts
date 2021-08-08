import Redis from 'ioredis'

const redisClient = new Redis({ host: process.env.REDIS_HOST })

redisClient.on('error', (error) => {
  console.error(error)
})

export { redisClient }
