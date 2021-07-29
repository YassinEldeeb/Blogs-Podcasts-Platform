import { Field, ID, ObjectType } from 'type-graphql'
import { User } from './User'

@ObjectType()
class NotificationFromUser {
  @Field((_type) => ID)
  id: string

  @Field((_type) => User)
  user: User

  notification: Notification
  notificationId: string
}
@ObjectType()
export class Notification {
  @Field((_type) => ID)
  id: string

  notifiedUserId: string

  @Field((_type) => User)
  notifiedUser: User

  @Field(() => [NotificationFromUser])
  fromUsers: NotificationFromUser[]

  @Field()
  seen: boolean

  @Field()
  message: string

  @Field()
  type: string

  @Field()
  url: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
