import { Field, ObjectType } from 'type-graphql'
import { User } from '@models/User'

@ObjectType()
export class AuthPayload {
  @Field((_type) => User)
  user: User
}
