import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { genTokens } from '../../auth/genTokens'
import { sendRefreshToken } from '../../auth/sendRefreshToken'
import { redisClient } from '../../redis'
import { MyContext } from '../../types/MyContext'
import { confirmUserPrefix } from '../constants/redisPrefixes'
import { Select } from '../shared/select/selectParamDecorator'
import { ConfirmEmailPayload } from './confirmEmail/confirmEmailPayload'

@Resolver()
class ConfirmEmailResolver {
  @Mutation((_returns) => ConfirmEmailPayload)
  async confirmEmail(
    @Arg('token') token: string,
    @Ctx() context: MyContext,
    @Select() select: any
  ): Promise<ConfirmEmailPayload> {
    const { prisma, res } = context

    const userId = await redisClient.get(`${confirmUserPrefix}${token}`)

    if (!userId) {
      return { confirmed: false }
    }

    const authUser = (await prisma.user.update({
      data: { confirmed: true },
      where: { id: userId },
      select: { ...select, id: true, tokenVersion: true },
    })) as any

    redisClient.del(`${confirmUserPrefix}${token}`)

    const { accessToken, refreshToken } = await genTokens(
      authUser.id,
      authUser.tokenVersion
    )

    sendRefreshToken(res, refreshToken)

    context.userId = authUser.id

    return { user: authUser, accessToken, confirmed: true }
  }
}

export { ConfirmEmailResolver }
