import { ArgsType, Field, ID } from 'type-graphql'
import { UserExists } from '@/resolvers/shared/validations/decorators/userExists'

@ArgsType()
export class UserIdInput {
  @Field(() => ID)
  @UserExists({ message: "User Doesn't exist!" })
  id: string
}
