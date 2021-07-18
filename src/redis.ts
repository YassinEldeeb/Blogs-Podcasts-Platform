import Redis from 'ioredis'

const redisClient = new Redis()

redisClient.on('error', (error) => {
  console.error(error)
})

export { redisClient }
