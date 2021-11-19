import { NotificationType } from '@Types/NotificationType'

export interface baseNotifyArgs {
  type: NotificationType
  url: string
  firedNotificationUserId: string
  options?: { remove?: boolean }
}
