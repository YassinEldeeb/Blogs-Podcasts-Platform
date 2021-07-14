import { Arg, Args, Ctx, Mutation, Resolver } from 'type-graphql'
import { User } from '../../models/User'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/selectParamDecorator'
import { UserIdInput } from './shared/UserIdInput'
import { UpdateUserInput } from './updateUser/UpdateUserInput'

@Resolver()
class UpdateUserResolver {
  @Mutation((_returns) => User)
  updateUser(
    @Args() { id }: UserIdInput,
    @Arg('data') data: UpdateUserInput,
    @Ctx() { prisma }: MyContext,
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
