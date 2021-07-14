import bcrypt from 'bcryptjs'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { genTokens } from '../../auth/genTokens'
import { sendRefreshToken } from '../../auth/sendRefreshToken'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/selectParamDecorator'
import { RegisterInput } from './register/RegisterInput'
import { AuthPayload } from './shared/authPayload'

@Resolver()
class RegisterResolver {
  @Mutation(() => AuthPayload)
  async register(
    @Arg('data') { name, email, password }: RegisterInput,
    @Ctx() { prisma, res }: MyContext,
    @Select() select: any
  ): Promise<AuthPayload> {
    const hashedPassword = bcrypt.hashSync(password, 10)

    const user = (await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { ...select, id: true, tokenVersion: true },
    })) as any

    const { accessToken, refreshToken } = await genTokens(
      user.id,
      user.tokenVersion
    )

    sendRefreshToken(res, refreshToken)

    return { user, accessToken }
  }
}

export { RegisterResolver }
