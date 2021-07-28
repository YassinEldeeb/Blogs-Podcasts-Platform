import { PostExists } from '@/resolvers/shared/validations/decorators/postExists'
import { ArgsType, Field, ID } from 'type-graphql'

@ArgsType()
export class PostIdInput {
  @Field(() => ID)
  @PostExists({ message: "Post Doesn't exist!" })
  postId: string
}
