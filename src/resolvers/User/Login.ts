import { Mutation, Resolver, Arg, Ctx } from 'type-graphql'
import { Select } from '../shared/selectParamDecorator'
import { AuthPayload } from './shared/authPayload'
import { LoginInput } from './login/loginInput'
import { ctx } from '../../types/ctx'
import bcrypt from 'bcryptjs'
import { genToken } from '../../utils/genToken'
import { checkUserExistance } from '../shared/validations/shared/checkUserExists'

@Resolver()
class LoginResolver {
  @Mutation((_returns) => AuthPayload)
  async login(
    @Arg('data') { email, password }: LoginInput,
    @Ctx() { prisma }: ctx,
    @Select() select: any
  ): Promise<AuthPayload> {
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
      select: { ...select, id: true },
    })) as any

    const token = genToken(authUser.id)

    return { user: authUser, token }
  }
}

export { LoginResolver }
