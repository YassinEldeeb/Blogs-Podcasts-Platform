import { CommentExists } from '@/resolvers/shared/validations/decorators/commentExists'
import { ArgsType, Field, ID } from 'type-graphql'

@ArgsType()
export class CommentIdInput {
  @Field(() => ID)
  @CommentExists({ message: "Comment Doesn't exist!" })
  commentId: string
}
