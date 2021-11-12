import { Args, ArgsType, Ctx, Mutation, Resolver } from 'type-graphql'
import { resetPasswordEmail } from '@emails/resetPassword'
import { MyContext } from '@Types/MyContext'
import { resendConfirmInput } from './confirmEmail/resendConfirmInput'
import { SuccessPayload } from './shared/successPayload'

@ArgsType()
class forgotPasswordInput extends resendConfirmInput {}

@Resolver()
class ForgotPasswordResolver {
  @Mutation(() => SuccessPayload)
  async forgotPassword(
    @Args() { email }: forgotPasswordInput,
    @Ctx() { prisma }: MyContext,
  ): Promise<SuccessPayload> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    })

    if (!user) {
      return { success: true }
    }
    if (!user.password) {
      throw new Error("Can't forgot password for OAuth Users")
    }

    resetPasswordEmail(user.id, email)

    return { success: true }
  }
}

export { ForgotPasswordResolver }
