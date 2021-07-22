import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { genTokens } from '../../auth/genTokens'
import { sendRefreshToken } from '../../auth/sendRefreshToken'
import { confirmEmail } from '../../emails/confirmEmail'
import { MyContext } from '../../@types/MyContext'
import { Select } from '../shared/select/selectParamDecorator'
import { RegisterInput } from './register/RegisterInput'
import { SecureData } from './shared/hashedPassword'
import { User } from '../../models/User'

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

    const { accessToken, refreshToken } = await genTokens(
      user.id,
      user.tokenVersion
    )

    confirmEmail(user.id, data.email)

    context.userId = user.id

    return user
  }
}

export { RegisterResolver }
