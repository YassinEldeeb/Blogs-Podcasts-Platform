import { MinLength } from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'
import { PostExists } from '../../../resolvers/shared/validations/decorators/postExists'
import { UserExists } from '../../../resolvers/shared/validations/decorators/userExists'

@InputType()
export class CreateCommentInput {
  @Field()
  @MinLength(1, {
    message: 'Text is too short',
  })
  @Field()
  text: string

  @Field((_type) => ID)
  @UserExists({ message: "Author doesn't exist" })
  authorId: string

  @Field((_type) => ID)
  @PostExists({ message: "Post doesn't exist" })
  postId: string
}
