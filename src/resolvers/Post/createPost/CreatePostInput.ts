import { MinLength, Length } from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'
import { UserExists } from '../../../resolvers/shared/validations/decorators/userExists'

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

  @Field(() => ID)
  @UserExists({ message: "User doesn't exist!" })
  authorId: string
}
