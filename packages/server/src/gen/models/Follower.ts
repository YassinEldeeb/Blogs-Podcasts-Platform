import { Field, ID, ObjectType } from 'type-graphql'
import { User } from './User'

@ObjectType()
export class Follower {
  @Field((_type) => ID)
  id: string

  @Field()
  followed_user: User

  @Field()
  follower_user: User

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  // skip overwrite 👇
  @Field()
  youCantDeleteMe: string
}