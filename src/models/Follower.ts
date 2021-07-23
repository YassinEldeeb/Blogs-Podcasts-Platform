import { Field, ID, ObjectType } from 'type-graphql'
import { User } from './User'

@ObjectType()
export class Follower {
  @Field((_type) => ID)
  id: string

  @Field((_type) => User)
  follower: User

  @Field((_type) => User)
  following: User

  followerId: string

  followingId: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
