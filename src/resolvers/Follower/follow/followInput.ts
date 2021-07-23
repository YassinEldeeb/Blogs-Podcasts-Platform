import { ArgsType, Field } from 'type-graphql'
import { UserExists } from '../../shared/validations/decorators/userExists'

@ArgsType()
export class FollowInput {
  @Field()
  @UserExists({ message: 'User Not Found!' })
  user_id: string
}
