import { models } from '@/types/enums/models'
import { baseBatch } from './shared/baseDataLoader'

const followersLoader = baseBatch({
  uniqueId: 'followed_userId',
  model: models.follower,
})

export { followersLoader }
