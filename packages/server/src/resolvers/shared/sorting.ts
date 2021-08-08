import { IsEmpty, ValidateIf } from 'class-validator'
import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'

enum Sorting {
  desc = 'desc',
  asc = 'asc',
}

registerEnumType(Sorting, {
  name: 'Sorting',
})

const twoAreProvidedErrMsg =
  'one of the fields createdAt or updatedAt should be specified.'

@InputType()
export class SortingArgs {
  @Field((_type) => Sorting, { nullable: true })
  @ValidateIf((o) => o.updatedAt)
  @IsEmpty({
    message: twoAreProvidedErrMsg,
  })
  createdAt?: Sorting

  @Field((_type) => Sorting, { nullable: true })
  @ValidateIf((o) => o.createdAt)
  @IsEmpty({ message: twoAreProvidedErrMsg })
  updatedAt?: Sorting
}
