import { Field, ObjectType } from 'type-graphql'
import { MutationType } from '@/types/enums/mutationType'

@ObjectType()
export class PublishedData {
  @Field((_type) => MutationType)
  mutation: MutationType

  @Field()
  id: string

  deleted?: boolean = false
}
