import { Args, Ctx, Mutation, Resolver } from 'type-graphql'
import { ctx } from '../../types/ctx'
import { User } from '../../models/User'
import { UserIdInput } from './shared/UserIdInput'
import { Select } from '../shared/selectParamDecorator'

@Resolver()
class DeleteUserResolver {
  @Mutation(() => User)
  async deleteUser(
    @Args() { id }: UserIdInput,
    @Ctx() { prisma }: ctx,
    @Select() select: any
  ): Promise<User> {
    return prisma.user.delete({ where: { id }, select }) as any
  }
}

export { DeleteUserResolver }
