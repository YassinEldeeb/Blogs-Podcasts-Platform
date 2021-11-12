import { Follower } from '@models/Follower'
import { models } from '@Types/enums/models'
import { baseBatch } from './explicit-cases/shared/baseDataLoader'

const followingLoader = baseBatch<Follower>({
  uniqueId: 'follower_userId',
  model: models.follower,
})

export { followingLoader }
