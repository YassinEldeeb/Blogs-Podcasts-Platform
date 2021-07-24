import { IsEmail, Length, MinLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { UserExists } from '@/resolvers/shared/validations/decorators/userExists'
import { IsEqualTo } from './isEqual'

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  name: string

  @Field()
  @IsEmail()
  @UserExists({ message: 'Email is taken', isProblem: true, byEmail: true })
  email: string

  @Field()
  @MinLength(8)
  password: string

  @Field()
  @IsEqualTo('confirmPassword', 'password')
  confirmPassword: string
}
