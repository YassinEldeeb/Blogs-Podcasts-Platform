import { Field, ObjectType } from 'type-graphql'
import { User } from '@models/User'

@ObjectType()
export class ConfirmEmailPayload {
  @Field((_type) => User, { nullable: true })
  user?: User

  @Field()
  confirmed: boolean
}
