import { Field, ID, ObjectType } from 'type-graphql'
import { Comment } from './Comment'
import { Post } from './Post'
import { User } from './User'

@ObjectType()
export class Heart {
  @Field((_type) => ID)
  id: string

  userId: string

  @Field((_type) => User)
  user: User

  postId?: string

  @Field(() => Post, { nullable: true })
  post?: Post

  commentId?: string

  @Field(() => Post, { nullable: true })
  comment?: Comment

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
