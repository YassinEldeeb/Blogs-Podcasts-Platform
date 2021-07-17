import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { genTokens } from '../../auth/genTokens'
import { sendRefreshToken } from '../../auth/sendRefreshToken'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/select/selectParamDecorator'
import { RegisterInput } from './register/RegisterInput'
import { AuthPayload } from './shared/authPayload'
import { SecureData } from './shared/hashedPassword'

@Resolver()
class RegisterResolver {
  @Mutation(() => AuthPayload)
  async register(
    @Arg('data') _unsecureData: RegisterInput,
    @Ctx() context: MyContext,
    @Select() select: any,
    @SecureData() data: any
  ): Promise<AuthPayload> {
    const { prisma, res } = context

    const user = (await prisma.user.create({
      data,
      select: { ...select, id: true, tokenVersion: true },
    })) as any

    const { accessToken, refreshToken } = await genTokens(
      user.id,
      user.tokenVersion
    )

    sendRefreshToken(res, refreshToken)

    context.userId = user.id

    return { user, accessToken }
  }
}

export { RegisterResolver }
