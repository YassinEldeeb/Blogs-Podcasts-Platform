import { Args, ArgsType, Ctx, Mutation, Resolver } from 'type-graphql'
import { resetPasswordEmail } from '../../emails/resetPassword'
import { MyContext } from '../../types/MyContext'
import { resendConfirmInput } from './confirmEmail/resendConfirmInput'
import { SuccessPayload } from './shared/successPayload'

@ArgsType()
class forgotPasswordInput extends resendConfirmInput {}

@Resolver()
class ForgotPasswordResolver {
  @Mutation((_type) => SuccessPayload)
  async forgotPassword(
    @Args() { email }: forgotPasswordInput,
    @Ctx() { prisma }: MyContext
  ): Promise<SuccessPayload> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    })

    if (!user) {
      return { success: true }
    }

    resetPasswordEmail(user.id, email)

    return { success: true }
  }
}

export { ForgotPasswordResolver }
