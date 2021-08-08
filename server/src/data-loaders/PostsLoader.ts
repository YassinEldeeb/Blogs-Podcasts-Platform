import { Post } from '@/models/Post'
import { models } from '@/types/enums/models'
import { baseBatch } from './shared/baseDataLoader'

const postsLoader = baseBatch<Post>({
  uniqueId: 'authorId',
  model: models.post,
  additionalWhere: { published: true },
})

export { postsLoader }
