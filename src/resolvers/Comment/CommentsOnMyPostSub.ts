import { Authorized, Root, Subscription } from 'type-graphql'
import { Topics } from '@/types/enums/subscriptions'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { ReturnComment } from './shared/ReturnComment'
import { CommentSubscriptionPayload } from './subscription/CommentSubscriptionPayload'

const { CommentsOnMyPosts } = Topics

class CommentsSubscriptionsResolver {
  @Subscription((_returns) => CommentSubscriptionPayload, {
    topics: ({ context: { userId } }) => `${CommentsOnMyPosts}:${userId}`,
    filter: async ({ payload, context: { userId } }) => {
      return payload.authorId !== userId
    },
  })
  @Authorized()
  async myPostsCommentsNotifications(
    @Root() data: PublishedData,
    @Select() select: any
  ): Promise<CommentSubscriptionPayload> {
    return ReturnComment(data, select)
  }
}

export { CommentsSubscriptionsResolver }
