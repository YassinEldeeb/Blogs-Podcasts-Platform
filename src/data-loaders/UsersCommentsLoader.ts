import { User } from '@/models/User'
import { models } from '@/types/enums/models'
import { baseBatch } from './shared/baseDataLoader'

const usersCommentsLoader = baseBatch<User>({
  uniqueId: 'authorId',
  model: models.comment,
})

export { usersCommentsLoader }
