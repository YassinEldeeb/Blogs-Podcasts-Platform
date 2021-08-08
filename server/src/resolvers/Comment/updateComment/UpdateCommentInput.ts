import { MinLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class UpdateCommentInput {
  @Field()
  @MinLength(1, {
    message: 'Text is too short',
  })
  @Field()
  text: string
}
