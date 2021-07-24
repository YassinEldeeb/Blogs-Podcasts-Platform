import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { MyContext } from '@/types/MyContext'
import { confirmEmail } from '@/emails/confirmEmail'
import { User } from '@/models/User'
import { Select } from '../shared/select/selectParamDecorator'
import { RegisterInput } from './register/RegisterInput'
import { SecureData } from './shared/hashedPassword'

@Resolver()
class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg('data') _unsecureData: RegisterInput,
    @Ctx() context: MyContext,
    @Select() select: any,
    @SecureData() data: any
  ): Promise<User> {
    const { prisma } = context

    const user = (await prisma.user.create({
      data,
      select: { ...select, id: true, tokenVersion: true },
    })) as any

    confirmEmail(user.id, data.email)

    context.userId = user.id

    return user
  }
}

export { RegisterResolver }
