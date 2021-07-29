import { Field, ID, ObjectType } from 'type-graphql'
import { Comment } from './Comment'
import { Post } from './Post'
import { Reply } from './Reply'
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

  replyId?: string

  @Field(() => Post, { nullable: true })
  reply?: Reply

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
