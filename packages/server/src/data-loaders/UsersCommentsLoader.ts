import { User } from '@models/User'
import { models } from '@Types/enums/models'
import { baseBatch } from './explicit-cases/shared/baseDataLoader'

const usersCommentsLoader = baseBatch<User>({
  uniqueId: 'authorId',
  model: models.comment,
})

export { usersCommentsLoader }
