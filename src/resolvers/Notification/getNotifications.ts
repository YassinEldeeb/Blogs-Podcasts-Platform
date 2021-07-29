import { Auth } from '@/middleware/Auth'
import { Notification } from '@/models/Notification'
import { MyContext } from '@/types/MyContext'
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Select } from '../shared/select/selectParamDecorator'

@Resolver()
class NotificationsResolver {
  @Query((_returns) => [Notification])
  @UseMiddleware(Auth())
  async myNotifications(
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any
  ) {
    const notifications = await prisma.notification.findMany({
      select,
      where: { notifiedUserId: userId },
    })

    return notifications
  }
}

export { NotificationsResolver }
