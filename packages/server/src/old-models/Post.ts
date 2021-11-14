import { Field, ID, Int, ObjectType } from 'type-graphql'
import { Comment } from './Comment'
import { Heart } from './Heart'
import { User } from './User'

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

  @Field()
  hearts_count: number

  @Field()
  comments_count: number

  @Field({ nullable: true })
  coverImg?: string

  @Field((_type) => [Heart])
  hearts: Heart[]

  authorId: string

  @Field((_type) => User)
  author: User

  @Field((_type) => [Comment])
  comments: Comment[]

  @Field()
  readingTimeTxt: string

  @Field()
  readingTimeMin: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
