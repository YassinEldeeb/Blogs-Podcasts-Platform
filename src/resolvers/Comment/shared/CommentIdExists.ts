import { ArgsType, Field, ID } from 'type-graphql'
import { CommentExists } from '../../../resolvers/shared/validations/decorators/commentExists'

@ArgsType()
export class CommentIdInput {
  @Field(() => ID)
  @CommentExists({ message: "Comment Doesn't exist!" })
  id: string
}
