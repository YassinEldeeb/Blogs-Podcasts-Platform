import { NotificationTypes } from '@/types/NotificationsTypes'

interface formateNamesArgs {
  names: string[]
  name: string
}

interface createMessageArgs {
  type: string
  names: string[]
  name: string
}

const formatedNames = ({ names, name }: formateNamesArgs) => {
  if (names.length < 3) {
    return names.join(' and ')
  } else {
    return `${name} and ${names.length - 1} others`
  }
}

export const createMessage = ({ type, names, name }: createMessageArgs) => {
  switch (type) {
    case NotificationTypes.newPosts:
      return `New Posts from ${formatedNames({ name, names })}`
    case NotificationTypes.newFollowers:
      return `${formatedNames({ name, names })} followed you`
    case NotificationTypes.heartOnPost:
      return `${formatedNames({ name, names })} liked your post`
    case NotificationTypes.heartOnComment:
      return `${formatedNames({ name, names })} liked your comment`
    case NotificationTypes.heartOnReply:
      return `${formatedNames({ name, names })} liked your reply`
    case NotificationTypes.reply:
      return `${formatedNames({ name, names })} replied to you`
    case NotificationTypes.newComments:
      return `${formatedNames({ name, names })} commented on your post`
    default:
      return 'new notification'
  }
}
