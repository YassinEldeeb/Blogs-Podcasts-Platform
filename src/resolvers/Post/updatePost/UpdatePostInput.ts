import { Field, InputType } from 'type-graphql'
import { MinLength, Length } from 'class-validator'

@InputType()
export class UpdatePostInput {
  @Field({ nullable: true })
  @Length(1, 255)
  @MinLength(1, {
    message: 'Title is too short',
  })
  title?: string

  @Field({ nullable: true })
  @MinLength(1, {
    message: 'Body is too short',
  })
  body?: string

  @Field({ nullable: true })
  published?: boolean

  @Field((_type) => [String], { nullable: true })
  tags?: string[]
}
