import { Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { isAuth } from '../../middleware/isAuth'
import { User } from '../../models/User'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/selectParamDecorator'

@Resolver()
class DeleteAccountResolver {
  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async deleteAccount(
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any
  ): Promise<User> {
    return prisma.user.delete({ where: { id: userId }, select }) as any
  }
}

export { DeleteAccountResolver }
