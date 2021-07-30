import { prisma } from '@/prisma'
import { baseNotifyArgs } from './shared/baseNotifyArgs'
import { createMessage } from './shared/createMessage'

interface notifyArgs extends baseNotifyArgs {
  notifiedUserId: string
}

export const notify = async ({
  notifiedUserId,
  firedNotificationUserId,
  type,
  url,
  options,
}: notifyArgs) => {
  const { name } = (await prisma.user.findUnique({
    where: { id: firedNotificationUserId },
    select: { name: true },
  })) as any

  const existingNotification = await prisma.notification.findFirst({
    where: { url, notifiedUser: { id: notifiedUserId } },
    select: {
      id: true,
      fromUsers: {
        select: {
          id: true,
          userWhoFired: { select: { id: true, name: true } },
        },
      },
    },
  })

  const filteredUsers =
    existingNotification?.fromUsers.filter((e: any) => {
      if (options?.remove) {
        return e.userWhoFired.id !== firedNotificationUserId
      }
      return true
    }) || []

  const names = [name, ...filteredUsers.map((e: any) => e.userWhoFired.name)]

  if (options?.remove) {
    names.shift()
  }

  const message = createMessage({ type, name, names })

  if (options?.remove && existingNotification) {
    // If there is a notification and it's action is reversed
    await prisma.notificationFromUser.deleteMany({
      where: {
        notification: { id: existingNotification.id },
        userWhoFiredId: firedNotificationUserId,
      },
    })

    // remove that particular action from the grouped notification
    // or delete it entirely if it wasn't grouped
    if (names[0]) {
      await prisma.notification.update({
        data: {
          message,
        },
        where: { id: existingNotification?.id },
      })
    } else {
      await prisma.notification.deleteMany({
        where: { url, id: existingNotification.id },
      })
    }
  } else if (existingNotification?.id) {
    // If there is a notification and we want
    // to add more actions to it
    await prisma.notification.update({
      data: {
        message,
        fromUsers: {
          create: {
            userId: notifiedUserId,
            userWhoFiredId: firedNotificationUserId,
          },
        },
      },
      where: { id: existingNotification?.id },
    })
  } else {
    // no notification, create a new one
    await prisma.notification.create({
      data: {
        message,
        type,
        url,
        notifiedUserId,
        fromUsers: {
          create: {
            userId: notifiedUserId,
            userWhoFiredId: firedNotificationUserId,
          },
        },
      },
    })
  }
}
