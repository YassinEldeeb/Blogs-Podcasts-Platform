import { Length, MinLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class CreatePostInput {
  @Field()
  @Length(1, 255)
  @MinLength(1, {
    message: 'Title is too short',
  })
  title: string

  @Field()
  @MinLength(1, {
    message: 'Body is too short',
  })
  body: string

  @Field({ nullable: true })
  published: boolean

  @Field(() => [String])
  tags: string[]

  readingTimeTxt: string
  readingTimeMin: number
}
