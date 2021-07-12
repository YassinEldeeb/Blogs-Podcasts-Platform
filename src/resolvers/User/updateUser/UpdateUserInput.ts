import { Field, InputType } from 'type-graphql'
import { UserExists } from '../../../resolvers/shared/validations/decorators/userExists'

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  @UserExists({ message: 'Email is taken!', isProblem: true, byEmail: true })
  email?: string

  @Field({ nullable: true })
  bio?: string
}
