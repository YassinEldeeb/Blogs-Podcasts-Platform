import { Field, ID, ObjectType } from 'type-graphql'
import { Comment } from './Comment'
import { Post } from './Post'

@ObjectType()
export class User {
  @Field((_type) => ID)
  id: string

  @Field()
  name: string

  @Field()
  email: string

  password: string

  @Field((_type) => [Post])
  posts: Post[]

  @Field((_type) => [Comment])
  comments: Comment[]

  @Field({ nullable: true })
  bio?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
