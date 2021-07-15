import { Field, ID, InputType } from 'type-graphql'
import { PostExists } from '../../../resolvers/shared/validations/decorators/postExists'
import { TextField } from '../shared/textField'

@InputType()
export class CreateCommentInput extends TextField {
  @Field((_type) => ID)
  @PostExists({ message: "Post doesn't exist" })
  postId: string
}
