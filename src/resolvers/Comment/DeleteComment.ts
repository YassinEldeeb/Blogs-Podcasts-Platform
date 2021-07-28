import { Comment } from '@/models/Comment'
import { deleteCommentOrReplyBase } from './shared/BaseDeleteComment'

deleteCommentOrReplyBase('Comment', Comment)
