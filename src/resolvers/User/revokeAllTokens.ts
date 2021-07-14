import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { MyContext } from '../../types/MyContext'

@Resolver()
export class RevokeResolver {
  @Mutation(() => Boolean)
  async revoke(
    @Arg('id') id: string,
    @Ctx() { prisma }: MyContext
  ): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id },
        data: { tokenVersion: { increment: 1 } },
      })
      return true
    } catch (_error) {
      return false
    }
  }
}
