import { PrismaSelect } from '@paljs/plugins'
import { GraphQLResolveInfo } from 'graphql'
import { Arg, Ctx, Info, Mutation, Resolver } from 'type-graphql'
import { RegisterInput } from './register/RegisterInput'
import bcrypt from 'bcryptjs'
import { ctx } from '../../types/ctx'
import { genToken } from '../../utils/genToken'
import { Select } from '../shared/selectParamDecorator'
import { AuthPayload } from './shared/authPayload'

@Resolver()
class RegisterResolver {
  @Mutation(() => AuthPayload)
  async register(
    @Arg('data') { name, email, password }: RegisterInput,
    @Ctx() { prisma }: ctx,
    @Select() select: any
  ): Promise<AuthPayload> {
    const hashedPassword = bcrypt.hashSync(password, 10)

    const user = (await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { ...select, id: true },
    })) as any

    const token = genToken(user.id)

    return { user, token }
  }
}

export { RegisterResolver }
