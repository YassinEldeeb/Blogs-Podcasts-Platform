import { Follower } from '@/models/Follower'
import { models } from '@/types/enums/models'
import { baseBatch } from './shared/baseDataLoader'

const followersLoader = baseBatch<Follower>({
  uniqueId: 'followed_userId',
  model: models.follower,
})

export { followersLoader }
