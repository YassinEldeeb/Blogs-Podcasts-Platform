import bcrypt from 'bcryptjs'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { genTokens } from '../../auth/genTokens'
import { sendRefreshToken } from '../../auth/sendRefreshToken'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/select/selectParamDecorator'
import { checkUserExistance } from '../shared/validations/shared/checkUserExists'
import { LoginInput } from './login/LoginInput'
import { AuthPayload } from './shared/authPayload'

@Resolver()
class LoginResolver {
  @Mutation((_returns) => AuthPayload)
  async login(
    @Arg('data') { email, password }: LoginInput,
    @Ctx() context: MyContext,
    @Select() select: any
  ): Promise<AuthPayload> {
    const { prisma, res } = context

    const userExists = await checkUserExistance({ email })

    if (!userExists) {
      throw new Error('Unable to Login!')
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true },
    })

    const isMatch = bcrypt.compareSync(password, user!.password)

    if (!isMatch) {
      throw new Error('Unable to Login!')
    }

    const authUser = (await prisma.user.findUnique({
      where: { email },
      select: { ...select, id: true, tokenVersion: true },
    })) as any

    const { accessToken, refreshToken } = await genTokens(
      authUser.id,
      authUser.tokenVersion
    )

    sendRefreshToken(res, refreshToken)

    context.userId = authUser.id

    return { user: authUser, accessToken }
  }
}

export { LoginResolver }
