import { Field, ID, ObjectType } from 'type-graphql'
import { Heart } from './Heart'
import { User } from './User'
import { Comment } from './Comment'

@ObjectType()
export class Post {
  @Field((_type) => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string

  @Field((_type) => [String])
  tags: string[]

  @Field()
  published: boolean

  @Field((_type) => [Heart])
  hearts: Heart[]

  @Field()
  hearts_count: number

  @Field()
  comments_count: number

  @Field((_type) => User)
  author: User

  @Field((_type) => [Comment])
  comments: Comment[]

  @Field()
  readingTimeTxt: string

  @Field()
  readingTimeMin: number

  @Field({ nullable: true })
  coverImg?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  // skip overwrite 👇
}