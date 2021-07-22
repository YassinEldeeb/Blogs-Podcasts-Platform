import { Field, ObjectType } from 'type-graphql'
import { User } from '../../../models/User'

@ObjectType()
export class AuthPayloadNull {
  @Field((_type) => User)
  user: User
}
