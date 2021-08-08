import { Post } from '@/models/Post'
import { models } from '@/types/enums/models'
import { baseBatch } from './shared/baseDataLoader'

const postsCommentsLoader = baseBatch<Post>({
  uniqueId: 'postId',
  model: models.comment,
})

export { postsCommentsLoader }
