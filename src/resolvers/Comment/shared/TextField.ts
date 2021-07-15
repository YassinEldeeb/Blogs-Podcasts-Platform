import { MinLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class TextField {
  @Field()
  @MinLength(1, {
    message: 'Text is too short',
  })
  @Field()
  text: string
}
