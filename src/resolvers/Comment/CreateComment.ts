import { Comment } from '@/models/Comment'
import { createCommentOrReplyBase } from '../Comment/shared/BaseCreateComment'
import { CreateCommentInput } from './createComment/CreateCommentInput'

createCommentOrReplyBase('Comment', Comment, CreateCommentInput)
