import { Field, ID, ObjectType } from 'type-graphql'
import { Comment } from './Comment'
import { Post } from './Post'

@ObjectType()
export class User {
  @Field((_type) => ID)
  id: string

  @Field()
  name: string

  @Field({ nullable: true })
  email: string

  password: string

  @Field((_type) => [Post], { nullable: true })
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
