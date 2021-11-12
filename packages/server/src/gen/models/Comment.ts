import { Field, ID, ObjectType } from 'type-graphql'
import { User } from './User'
import { Post } from './Post'
import { Heart } from './Heart'

@ObjectType()
export class Comment {
  @Field((_type) => ID)
  id: string

  @Field()
  text: string

  @Field()
  author: User

  @Field()
  post: Post

  @Field()
  hearts: Heart[]

  @Field()
  hearts_count: number

  @Field({ nullable: true })
  parentId?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  // skip overwrite 👇
}