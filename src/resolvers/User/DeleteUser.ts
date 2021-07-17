import { Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { Auth } from '../../middleware/Auth'
import { User } from '../../models/User'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/select/selectParamDecorator'

@Resolver()
class DeleteAccountResolver {
  @Mutation(() => User)
  @Auth()
  async deleteAccount(
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any
  ): Promise<User> {
    return prisma.user.delete({ where: { id: userId }, select }) as any
  }
}

export { DeleteAccountResolver }
