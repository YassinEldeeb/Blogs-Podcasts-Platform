import { Field, ID, ObjectType } from 'type-graphql'
import { User } from './User'
import { Post } from './Post'
import { Comment } from './Comment'

@ObjectType()
export class Heart {
  @Field((_type) => ID)
  id: string

  @Field()
  user: User

  @Field({ nullable: true })
  post?: Post

  @Field({ nullable: true })
  comment?: Comment

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  // skip overwrite 👇
}