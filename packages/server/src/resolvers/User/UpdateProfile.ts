import { Auth } from '@middleware/Auth'
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { checkPassword } from '@auth/checkPassword'
import { User } from '@models/User'
import { MyContext } from '@Types/MyContext'
import { Select } from '../shared/select/selectParamDecorator'
import { SecureData } from './shared/hashedPassword'
import { UpdateUserInput } from './updateUser/UpdateUserInput'

@Resolver()
class UpdateUserProfileResolver {
  @Mutation((_returns) => User)
  @UseMiddleware(Auth())
  async updateProfile(
    @Arg('data') _unsecureData: UpdateUserInput,
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any,
    @SecureData() data: any,
  ) {
    if (_unsecureData.oldPassword) {
      const { password } = (await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      })) as any

      if (!password) {
        throw Error('Unable to Change Password for OAuth Users')
      }

      checkPassword(
        password,
        _unsecureData.oldPassword,
        'Unable to Change the Password!',
      )
    }
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
