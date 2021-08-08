import { NotificationTypes } from '@/types/NotificationsTypes'

export interface baseNotifyArgs {
  type: NotificationTypes
  url: string
  firedNotificationUserId: string
  options?: { remove?: boolean }
}
