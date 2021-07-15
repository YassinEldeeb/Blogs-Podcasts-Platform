import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { Auth } from '../../middleware/Auth'
import { User } from '../../models/User'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/selectParamDecorator'
import { UpdateUserInput } from './updateUser/UpdateUserInput'

@Resolver()
class UpdateUserProfileResolver {
  @Mutation((_returns) => User)
  @Auth()
  updateProfile(
    @Arg('data') data: UpdateUserInput,
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select,
    })
  }
}

export { UpdateUserProfileResolver }
