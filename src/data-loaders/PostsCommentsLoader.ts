import { models } from '@/types/enums/models'
import { baseBatch } from './shared/baseDataLoader'

const postsCommentsLoader = baseBatch({
  uniqueId: 'postId',
  model: models.comment,
})

export { postsCommentsLoader }
