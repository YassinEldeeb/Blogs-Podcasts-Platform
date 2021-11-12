import { Field, ID, ObjectType } from 'type-graphql'
import { User } from './User'
import { NotificationFromUser } from './NotificationFromUser'
import { NotificationType } from '../another/long/nested/dir/for/enums/enums/NotificationType'

@ObjectType()
export class Notification {
  @Field((_type) => ID)
  id: string

  @Field()
  notifiedUser: User

  @Field()
  fromUsers: NotificationFromUser[]

  @Field()
  seen: boolean

  @Field()
  message: string

  @Field()
  type: NotificationType

  @Field()
  url: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  // skip overwrite 👇
}