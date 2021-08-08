import { Follower } from '@/models/Follower'
import { models } from '@/types/enums/models'
import { baseBatch } from './shared/baseDataLoader'

const followingLoader = baseBatch<Follower>({
  uniqueId: 'follower_userId',
  model: models.follower,
})

export { followingLoader }
