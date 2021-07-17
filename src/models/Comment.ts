import { Field, ID, ObjectType } from 'type-graphql'
import { Post } from './Post'
import { User } from './User'

@ObjectType()
export class Comment {
  @Field((_type) => ID)
  id: string

  @Field()
  text: string

  authorId: string

  @Field((_type) => User)
  author: User

  postId: string

  @Field(() => Post)
  post: Post

  @Field()
  bio: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
