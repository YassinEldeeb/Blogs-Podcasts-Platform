import { Field, ID, ObjectType } from 'type-graphql'
import { Post } from './Post'
import { User } from './User'

@ObjectType()
export class Heart {
  @Field((_type) => ID)
  id: string

  userId: string

  @Field((_type) => User)
  user: User

  postId: string

  @Field(() => Post)
  post: Post

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
