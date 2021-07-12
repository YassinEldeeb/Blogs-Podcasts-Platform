import { IsEmail } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { UserExists } from '../../shared/validations/decorators/userExists'

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  password: string
}
