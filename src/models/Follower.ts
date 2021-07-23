import { Field, ID, ObjectType } from 'type-graphql'
import { User } from './User'

@ObjectType()
export class Follower {
  @Field((_type) => ID)
  id: string

  @Field((_type) => User)
  follower_user: User

  @Field((_type) => User)
  followed_user: User

  followerId: string

  userId: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
