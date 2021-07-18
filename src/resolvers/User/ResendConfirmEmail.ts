import { Args, Ctx, Mutation, Resolver } from 'type-graphql'
import { confirmEmail } from '../../emails/confirmEmail'
import { MyContext } from '../../types/MyContext'
import { resendConfirmInput } from './confirmEmail/resendConfirmInput'
import { SuccessPayload } from './shared/successPayload'

@Resolver()
class ResendConfirmEmail {
  @Mutation(() => SuccessPayload)
  async resendConfirmEmail(
    @Args() { email }: resendConfirmInput,
    @Ctx() { prisma }: MyContext
  ): Promise<SuccessPayload> {
    const user = await prisma.user.findFirst({
      where: { email, confirmed: false },
      select: { id: true },
    })

    if (!user) {
      throw new Error('Unable to send Confirmation Email! ')
    }

    confirmEmail(user!.id, email)

    return { success: true }
  }
}

export { ResendConfirmEmail }
