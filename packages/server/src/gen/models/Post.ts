import { Field, ID, ObjectType } from 'type-graphql'
import { Heart } from './Heart'
import { User } from './User'
import { Comment } from './Comment'
import { Prisma } from '@prisma/client'
import GraphQLScalars from 'graphql-scalars'

@ObjectType()
export class Post {
  @Field((_type) => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string

  @Field()
  tags: string[]

  @Field()
  published: boolean

  @Field()
  hearts: Heart[]

  @Field()
  hearts_count: number

  @Field()
  comments_count: number

  @Field()
  author: User

  @Field()
  comments: Comment[]

  @Field()
  readingTimeTxt: string

  @Field()
  readingTimeMin: number

  @Field({ nullable: true })
  coverImg?: string

  @Field((_type) => GraphQLScalars.JSONResolver)
  json: Prisma.JsonValue

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  // skip overwrite 👇
}