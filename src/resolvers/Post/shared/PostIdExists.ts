import { ArgsType, Field, ID } from 'type-graphql'
import { PostExists } from '../../../resolvers/shared/validations/decorators/postExists'

@ArgsType()
export class PostIdInput {
  @Field(() => ID)
  @PostExists({ message: "Post Doesn't exist!" })
  id: string
}
