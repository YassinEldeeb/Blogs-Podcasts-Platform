import { Field, ObjectType } from 'type-graphql'
import { PublishedData } from '../../shared/subscription/PublishedData'

@ObjectType()
export class PostPublishedData extends PublishedData {
  @Field({ nullable: true })
  deleted?: boolean = false
}
