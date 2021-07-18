import { IsDefined, MinLength, ValidateIf, Equals } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { UserExists } from '../../../resolvers/shared/validations/decorators/userExists'

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  @UserExists({ message: 'Email is taken!', isProblem: true, byEmail: true })
  email?: string

  @Field({ nullable: true })
  bio?: string

  @ValidateIf((o) => o.oldPassword)
  @MinLength(8)
  @IsDefined()
  @Field({ nullable: true })
  newPassword: string

  @Field({ nullable: true })
  @ValidateIf((o) => o.newPassword)
  @IsDefined()
  oldPassword: string
}
