import { models } from '@/types/enums/models'
import { baseBatch } from './shared/baseDataLoader'

const followingLoader = baseBatch({
  uniqueId: 'follower_userId',
  model: models.follower,
})

export { followingLoader }
