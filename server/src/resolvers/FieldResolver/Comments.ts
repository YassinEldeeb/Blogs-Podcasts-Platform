import { Post } from '@/models/Post'
import { User } from '@/models/User'
import { commentsBaseResolver } from './shared/CommentsBaseField'

commentsBaseResolver('authorId', User)
commentsBaseResolver('postId', Post)
