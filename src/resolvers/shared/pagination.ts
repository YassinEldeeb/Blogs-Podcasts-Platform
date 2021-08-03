import { Max } from 'class-validator'
import { ArgsType, Field, Int } from 'type-graphql'

const cursorIdDescription =
  "Provide a cursor id which we'll start paginating from, then add 'take' value to be positive if you want after that cursor or negative if you want before it."

@ArgsType()
export class PaginationArgs {
  @Field((_type) => Int)
  skip: number = 0

  @Field((_type) => Int)
  @Max(100)
  take: number = 15

  @Field((_type) => String, {
    nullable: true,
    description: cursorIdDescription,
  })
  cursorId?: string
}
