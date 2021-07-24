import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { redisClient } from '@/redis'
import { MyContext } from '@/types/MyContext'
import { forgotPasswordPrefix } from '../constants/redisPrefixes'
import { ResetPasswordInput } from './resetPassword/resetPasswordInput'
import { SecureData } from './shared/hashedPassword'
import { SuccessPayload } from './shared/successPayload'

@Resolver()
class ResetPasswordResolver {
  @Mutation((_type) => SuccessPayload)
  async resetPassword(
    @Arg('token') token: string,
    @Arg('data') _unsecureData: ResetPasswordInput,
    @Ctx() { prisma }: MyContext,
    @SecureData() data: any
  ): Promise<SuccessPayload> {
    const userId = await redisClient.get(`${forgotPasswordPrefix}${token}`)

    if (!userId) {
      return { success: false }
    }

    await prisma.user.update({
      data: { ...data, tokenVersion: { increment: 1 } },
      where: { id: userId },
    })

    await redisClient.del(`${forgotPasswordPrefix}${token}`)

    return { success: true }
  }
}

export { ResetPasswordResolver }
