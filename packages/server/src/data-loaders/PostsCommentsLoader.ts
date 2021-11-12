import { Post } from '@models/Post'
import { models } from '@Types/enums/models'
import { baseBatch } from './explicit-cases/shared/baseDataLoader'

const postsCommentsLoader = baseBatch<Post>({
  uniqueId: 'postId',
  model: models.comment,
})

export { postsCommentsLoader }
