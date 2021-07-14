import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'
import { isAuth } from '../../middleware/isAuth'
import { User } from '../../models/User'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/selectParamDecorator'

@Resolver()
class MeResolver {
  @Query(() => User)
  @UseMiddleware(isAuth)
  async me(
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any
  ): Promise<User> {
    return prisma.user.findUnique({ where: { id: userId }, select }) as any
  }
}

export { MeResolver }
