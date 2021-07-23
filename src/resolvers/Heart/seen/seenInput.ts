import { ArgsType, Field } from 'type-graphql'
import { HeartExists } from '../../shared/validations/decorators/heartExists'

@ArgsType()
export class SeenInput {
  @Field()
  @HeartExists()
  id: string
}
