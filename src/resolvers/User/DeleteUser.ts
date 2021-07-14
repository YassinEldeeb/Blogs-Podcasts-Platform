import { Args, Ctx, Mutation, Resolver } from 'type-graphql'
import { User } from '../../models/User'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/selectParamDecorator'
import { UserIdInput } from './shared/UserIdInput'

@Resolver()
class DeleteUserResolver {
  @Mutation(() => User)
  async deleteUser(
    @Args() { id }: UserIdInput,
    @Ctx() { prisma }: MyContext,
    @Select() select: any
  ): Promise<User> {
    return prisma.user.delete({ where: { id }, select }) as any
  }
}

export { DeleteUserResolver }
