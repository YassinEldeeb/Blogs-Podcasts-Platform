import { Follower } from '@models/Follower'
import { models } from '@Types/enums/models'
import { baseBatch } from './explicit-cases/shared/baseDataLoader'

const followersLoader = baseBatch<Follower>({
  uniqueId: 'followed_userId',
  model: models.follower,
})

export { followersLoader }
