import { MinLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { IsEqualTo } from '../register/isEqual'

@InputType()
export class ResetPasswordInput {
  @MinLength(8)
  @Field()
  password: string

  @Field()
  @IsEqualTo('confirmPassword', 'password')
  confirmPassword: string
}
