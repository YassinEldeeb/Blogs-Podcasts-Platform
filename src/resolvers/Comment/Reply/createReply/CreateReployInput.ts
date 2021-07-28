import { CreateCommentInput } from '@/resolvers/Comment/createComment/CreateCommentInput'
import { CommentExists } from '@/resolvers/shared/validations/decorators/commentExists'
import { Field, ID, InputType } from 'type-graphql'

@InputType()
export class CreateReplyInput extends CreateCommentInput {
  @Field((_type) => ID)
  @CommentExists({ message: "Comment doesn't exist" })
  commentId: string
}
