import { IsEmail } from 'class-validator'
import { ArgsType, Field } from 'type-graphql'

@ArgsType()
export class resendConfirmInput {
  @Field()
  @IsEmail()
  email: string
}
