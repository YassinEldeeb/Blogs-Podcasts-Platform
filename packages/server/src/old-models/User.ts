import { Field, ID, ObjectType } from 'type-graphql'
import { Comment } from './Comment'
import { Follower } from './Follower'
import { Heart } from './Heart'
import { Post } from './Post'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field()
  username: string

  @Field({ nullable: true })
  email: string

  password: string

  confirmed: boolean

  tokenVersion: number

  hearts: Heart[]

  @Field({ nullable: true })
  profilePic?: string

  @Field(() => [Post])
  posts: Post[]

  @Field(() => [Comment])
  comments: Comment[]

  @Field({ nullable: true })
  bio?: string

  @Field(() => [Follower])
  followers: Follower[]

  @Field(() => [Follower])
  following: Follower[]

  @Field()
  followers_count: number

  @Field()
  following_count: number

  @Field(() => [Follower])
  followedBy: Follower[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
