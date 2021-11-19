import { NotificationType } from '@Types/NotificationType'

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

export const createMessage = ({
  type,
  names,
  name,
}: createMessageArgs): string => {
  switch (type) {
    case NotificationType.newPosts:
      return `New Posts from ${formatedNames({ name, names })}`
    case NotificationType.newFollowers:
      return `${formatedNames({ name, names })} followed you`
    case NotificationType.heartOnPost:
      return `${formatedNames({ name, names })} liked your post`
    case NotificationType.heartOnComment:
      return `${formatedNames({ name, names })} liked your comment`
    case NotificationType.heartOnReply:
      return `${formatedNames({ name, names })} liked your reply`
    case NotificationType.reply:
      return `${formatedNames({ name, names })} replied to you`
    case NotificationType.newComments:
      return `${formatedNames({ name, names })} commented on your post`
    default:
      return 'new notification'
  }
}
