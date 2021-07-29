import { prisma } from '@/prisma'
import { NotificationTypes } from '@/types/NotificationsTypes'

const createMessage = (type: string, formatedNames: () => string) => {
  switch (type) {
    case NotificationTypes.newPosts:
      return `New Post notifications from ${formatedNames()}`
    case NotificationTypes.newFollowers:
      return `${formatedNames()} followed you`
    case NotificationTypes.heartOnPost:
      return `${formatedNames()} liked your post`
    case NotificationTypes.heartOnComment:
      return `${formatedNames()} liked your comment`
    case NotificationTypes.heartOnReply:
      return `${formatedNames()} liked your reply`
    case NotificationTypes.reply:
      return `${formatedNames()} replied to you`
    case NotificationTypes.newComments:
      return `${formatedNames()} commented on your post`
    default:
      return 'new notification'
  }
}

export const notify = async (
  notifiedUserId: string,
  type: NotificationTypes,
  url: string,
  firedNotificationUserId: string,
  options?: { remove: boolean }
) => {
  const { name } = (await prisma.user.findUnique({
    where: { id: firedNotificationUserId },
    select: { name: true },
  })) as any

  const existingNotif = await prisma.notification.findFirst({
    where: { url },
    select: {
      id: true,
      fromUsers: {
        select: { userWhoFired: { select: { id: true, name: true } } },
      },
    },
  })

  const filteredUsers =
    existingNotif?.fromUsers.filter((e: any) => {
      if (options?.remove) {
        return e.userWhoFired.id !== firedNotificationUserId
      }
      return true
    }) || []

  const names = [name, ...filteredUsers.map((e: any) => e.userWhoFired.name)]

  if (options?.remove) {
    names.shift()
  }

  const formatedNames = () => {
    if (names.length < 3) {
      return names.join(' and ')
    } else {
      return `${name} and ${names.length - 1} others`
    }
  }

  const message = createMessage(type, formatedNames)

  if (options?.remove && existingNotif) {
    // If removing action from existing notification
    await prisma.notificationFromUser.deleteMany({
      where: {
        userId: notifiedUserId,
        notification: { url },
        userWhoFiredId: firedNotificationUserId,
      },
    })

    if (names[0]) {
      await prisma.notification.update({
        data: {
          message,
        },
        where: { id: existingNotif?.id },
      })
    } else {
      await prisma.notification.deleteMany({
        where: { url, id: existingNotif.id },
      })
    }
  } else if (existingNotif?.id) {
    // If adding new action from existing notification
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
      where: { id: existingNotif?.id },
    })
  } else {
    // If creating whole new notification
    await prisma.notification.create({
      data: {
        message,
        type,
        url,
        notifiedUserId,
        fromUsers: {
          createMany: {
            data: [
              {
                userId: notifiedUserId,
                userWhoFiredId: firedNotificationUserId,
              },
            ],
          },
        },
      },
    })
  }
}
