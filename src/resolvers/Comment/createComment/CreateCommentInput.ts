import { PostExists } from '@/resolvers/shared/validations/decorators/postExists'
import { MinLength } from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'

@InputType()
export class CreateCommentInput {
  @Field()
  @MinLength(1, {
    message: 'Text is too short',
  })
  @Field()
  text: string

  @Field((_type) => ID)
  @PostExists({ message: "Post doesn't exist", published: true })
  postId: string
}
