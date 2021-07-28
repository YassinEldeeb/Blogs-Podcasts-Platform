import { Reply } from '@/models/Reply'
import { createCommentOrReplyBase } from '../shared/BaseCreateComment'
import { CreateReplyInput } from './createReply/CreateReployInput'

createCommentOrReplyBase('Reply', Reply, CreateReplyInput)
