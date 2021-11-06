import { prisma } from '@/prisma'
import { baseNotifyArgs } from './shared/baseNotifyArgs'
import { createMessage } from './shared/createMessage'
import cuid from 'cuid'

interface notifyManyArgs extends baseNotifyArgs {
  notifiedUsersIds: string[]
}

export const notifyMany = async ({
  notifiedUsersIds,
  firedNotificationUserId,
  type,
  url,
  options,
}: notifyManyArgs) => {
  // 1- Find the name of the user who fired the notification.
  const { name } = (await prisma.user.findUnique({
    where: { id: firedNotificationUserId },
    select: { name: true },
  })) as any

  // 2- Find Existing notifications for Users
  const existingNotifications = await prisma.notification.findMany({
    where: { url, notifiedUserId: { in: notifiedUsersIds } },
    select: {
      id: true,
      notifiedUserId: true,
      fromUsers: {
        select: { userWhoFired: { select: { id: true, name: true } } },
      },
      notifiedUser: { select: { id: true } },
    },
  })

  const existingNotifiedUserIds = existingNotifications.map(
    (e) => e.notifiedUserId
  )

  // 3- Find the difference between NotifiedUserIds & existingNotifiedUserIds
  // to make new notifications for those who doesn't have any notifications
  // yet to be grouped
  const difference = existingNotifiedUserIds
    .filter((x) => !notifiedUsersIds.includes(x))
    .concat(
      notifiedUsersIds.filter((x) => !existingNotifiedUserIds.includes(x))
    )

  const updatedNotifications: any[] = []
  const updatedNotificationsWithFromUsers: any[] = []
  const deletingNotifications: any[] = []

  let notificationIds: string[] = []

  if (existingNotifications.length) {
    existingNotifications.forEach((notification: any, i) => {
      const names = [
        name,
        ...notification.fromUsers
          .filter((e: any) => e.userWhoFired.id !== firedNotificationUserId)
          .map((e: any) => e.userWhoFired.name),
      ]

      if (options?.remove) {
        names.shift()
      }

      if (!names[0] && options?.remove) {
        deletingNotifications.push(notification.id)
      } else {
        const message = createMessage({ type, name, names })

        const updatedNotification = {
          id: notification.id,
          message,
          notifiedUserId: existingNotifiedUserIds[i],
          type,
          url,
        }
        updatedNotifications.push({
          ...updatedNotification,
        })
        updatedNotificationsWithFromUsers.push({
          ...updatedNotification,
          fromUsers: notification.fromUsers,
        })
      }
    })

    updatedNotifications.map((e: any) => notificationIds.push(e.id))

    // 4- Delete all existing notifications
    await prisma.notification.deleteMany({
      where: { id: { in: notificationIds } },
    })

    // 5- Create all notifications that were
    // existing but insert them updated.
    await prisma.notification.createMany({
      data: updatedNotifications,
    })

    // 6- Delete all notifications that were not grouped
    await prisma.notification.deleteMany({
      where: { id: { in: deletingNotifications } },
    })

    const notificationFromUsers: any[] = []

    updatedNotificationsWithFromUsers.map((notification: any) => {
      notification.fromUsers.map((fromUser: any) => {
        if (
          options?.remove
            ? fromUser.userWhoFired.id !== firedNotificationUserId
            : true
        ) {
          notificationFromUsers.push({
            notificationId: notification.id,
            userId: notification.notifiedUserId,
            userWhoFiredId: fromUser.userWhoFired.id,
          })
        }
      })
      if (!options?.remove) {
        notificationFromUsers.push({
          notificationId: notification.id,
          userId: notification.notifiedUserId,
          userWhoFiredId: firedNotificationUserId,
        })
      }
    })

    await prisma.notificationFromUser.createMany({
      data: notificationFromUsers,
    })

    notificationIds = []
  }

  const names = [name]

  const message = createMessage({ type, name, names })

  await prisma.notification.createMany({
    data: [
      ...difference.map((notifiedUserId: string) => {
        const id = cuid()
        notificationIds.push(id)

        return {
          id,
          message,
          notifiedUserId,
          type,
          url,
        }
      }),
    ],
  })

  await prisma.notificationFromUser.createMany({
    data: [
      ...difference.map((notifiedUserId: string, i) => {
        return {
          notificationId: notificationIds[i],
          userId: notifiedUserId,
          userWhoFiredId: firedNotificationUserId,
        }
      }),
    ],
  })
}
