import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { MyContext } from '@/types/MyContext'
import { Auth } from '@/middleware/Auth'
import { redisClient } from '@/redis'
import { deleteAccountPerfix } from '../constants/redisPrefixes'
import { Select } from '../shared/select/selectParamDecorator'
import { SuccessPayload } from './shared/successPayload'

@Resolver()
class DeleteAccountResolver {
  @Mutation(() => SuccessPayload)
  @UseMiddleware(Auth())
  async deleteAccount(
    @Arg('token') token: string,
    @Ctx() { prisma }: MyContext,
    @Select() select: any
  ): Promise<SuccessPayload> {
    const userId = await redisClient.get(`${deleteAccountPerfix}${token}`)
    console.log(userId, token)
    if (!userId) {
      return { success: false }
    }

    await prisma.user.delete({ where: { id: userId } })
    await redisClient.del(`${deleteAccountPerfix}${token}`)

    return { success: true }
  }
}

export { DeleteAccountResolver }
