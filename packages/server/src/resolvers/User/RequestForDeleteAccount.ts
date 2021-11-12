import { Args, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { Auth } from '@middleware/Auth'
import { User } from '@models/User'
import { MyContext } from '@Types/MyContext'
import { Select } from '../shared/select/selectParamDecorator'
import { confirmDeleteAccount } from '@emails/deleteAccount'
import { resendConfirmInput } from './confirmEmail/resendConfirmInput'
import { SuccessPayload } from './shared/successPayload'

@Resolver()
class RequestForDeleteAccountResolver {
  @Mutation(() => SuccessPayload)
  @UseMiddleware(Auth())
  async requestDeleteAccount(
    @Args() { email }: resendConfirmInput,
    @Ctx() { prisma }: MyContext,
  ): Promise<SuccessPayload> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (!user) {
      return { success: true }
    }

    confirmDeleteAccount(user!.id, email)

    return { success: true }
  }
}

export { RequestForDeleteAccountResolver }
