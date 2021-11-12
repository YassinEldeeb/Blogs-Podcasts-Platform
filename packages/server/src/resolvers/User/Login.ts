import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { MyContext } from '@Types/MyContext'
import { Select } from '../shared/select/selectParamDecorator'
import { checkUserExistance } from '../shared/validations/shared/checkUserExists'
import { LoginInput } from './login/LoginInput'
import { AuthPayload } from './shared/authPayload'
import { genRefreshToken } from '@auth/utils/genRefreshToken'
import { checkPassword } from '@auth/checkPassword'
import { sendRefreshToken } from '@auth/sendRefreshToken'

@Resolver()
class LoginResolver {
  @Mutation((_returns) => AuthPayload)
  async login(
    @Arg('data') { email, password }: LoginInput,
    @Ctx() context: MyContext,
    @Select() select: any,
  ): Promise<AuthPayload> {
    const { prisma, res } = context

    const userExists = await checkUserExistance({ email })

    if (!userExists) {
      throw new Error('Unable to Login!')
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true, confirmed: true },
    })

    if (!user?.password) {
      throw new Error('Unable to Login!')
    }

    checkPassword(user!.password, password, 'Unable to Login!')

    if (!user?.confirmed) {
      throw new Error('You need to confirm your email first be logged in')
    }

    const authUser = (await prisma.user.findUnique({
      where: { email },
      select: { ...select, id: true, tokenVersion: true },
    })) as any

    const refreshToken = await genRefreshToken(
      authUser.id,
      authUser.tokenVersion,
    )

    sendRefreshToken(res, refreshToken)

    context.userId = authUser.id

    return { user: authUser }
  }
}

export { LoginResolver }
