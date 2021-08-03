import { models } from '@/types/enums/models'
import { baseBatch } from './shared/baseDataLoader'

const postsLoader = baseBatch({
  uniqueId: 'authorId',
  model: models.post,
  additionalWhere: { published: true },
})

export { postsLoader }
