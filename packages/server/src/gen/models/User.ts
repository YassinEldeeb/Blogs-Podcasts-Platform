import { Field, ID, ObjectType } from 'type-graphql'
import { Post } from './Post'
import { Comment } from './Comment'
import { Follower } from './Follower'
import { Notification } from './Notification'
import GraphQLScalars from 'graphql-scalars'

@ObjectType()
export class User {
  @Field((_type) => ID)
  id: string

  @Field((_type) => [GraphQLScalars.ByteResolver])
  test: Buffer[]

  @Field()
  name: string

  @Field({ nullable: true })
  username?: string

  @Field()
  email: string

  @Field({ nullable: true })
  bio?: string

  @Field({ nullable: true })
  profilePic?: string

  @Field()
  posts: Post[]

  @Field()
  comments: Comment[]

  @Field()
  followers_count: number

  @Field()
  following_count: number

  @Field()
  followers: Follower[]

  @Field()
  following: Follower[]

  @Field()
  notifications: Notification[]

  @Field({ nullable: true })
  githubId?: string

  @Field({ nullable: true })
  lastTimelineVisit?: Date

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  // skip overwrite 👇
}