import { Field, ID, ObjectType } from 'type-graphql'
import { Comment } from './Comment'
import { Post } from './Post'
import { User } from './User'

@ObjectType()
export class Reply {
  @Field((_type) => ID)
  id: string

  @Field()
  text: string

  authorId: string

  @Field((_type) => User)
  author: User

  postId: string

  @Field((_type) => Comment)
  comment: Comment

  commentId: string

  @Field(() => Post)
  post: Post

  @Field()
  bio: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
