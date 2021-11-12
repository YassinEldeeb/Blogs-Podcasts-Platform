import { Post } from '@models/Post'
import { models } from '@Types/enums/models'
import { baseBatch } from './explicit-cases/shared/baseDataLoader'

const postsLoader = baseBatch<Post>({
  uniqueId: 'authorId',
  model: models.post,
  additionalWhere: { published: true },
})

export { postsLoader }
