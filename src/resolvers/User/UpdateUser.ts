import { Resolver, Mutation, Ctx, Arg, Args } from 'type-graphql'
import { User } from '../../models/User'
import { ctx } from '../../types/ctx'
import { UpdateUserInput } from './updateUser/UpdateUserInput'
import { UserIdInput } from './shared/UserIdInput'
import { Select } from '../shared/selectParamDecorator'

@Resolver()
class UpdateUserResolver {
  @Mutation((_returns) => User)
  updateUser(
    @Args() { id }: UserIdInput,
    @Arg('data') data: UpdateUserInput,
    @Ctx() { prisma }: ctx,
    @Select() select: any
  ): Promise<User> {
    return prisma.user.update({
      where: {
        id,
      },
      data,
      select,
    }) as any
  }
}

export { UpdateUserResolver }
