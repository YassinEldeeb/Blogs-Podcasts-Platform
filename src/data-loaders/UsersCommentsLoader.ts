import { models } from '@/types/enums/models'
import { baseBatch } from './shared/baseDataLoader'

const usersCommentsLoader = baseBatch({
  uniqueId: 'authorId',
  model: models.comment,
})

export { usersCommentsLoader }
