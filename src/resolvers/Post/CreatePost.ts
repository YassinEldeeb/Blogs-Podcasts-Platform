import { Auth } from '@/middleware/Auth'
import { Post } from '@/models/Post'
import { CREATED } from '@/types/enums/mutationType'
import { Topics } from '@/types/enums/subscriptions'
import { MyContext } from '@/types/MyContext'
import {
  Arg,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { CreatePostInput } from './createPost/CreatePostInput'
import readingTime from 'reading-time'
import { notify } from '../shared/notifications/Notify'
import { NotificationTypes } from '@/types/NotificationsTypes'

@Resolver()
class CreatePostResolver {
  @Mutation((_returns) => Post)
  @UseMiddleware(Auth())
  async createPost(
    @Arg('data') data: CreatePostInput,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Post> {
    let readTime: { text: string; minutes: number }

    try {
      readTime = readingTime(data.body)
    } catch (error) {
      readTime = { text: 'over an hour read', minutes: 60 }
    }

    data.readingTimeTxt = readTime.text
    data.readingTimeMin = readTime.minutes

    const newPost = (await prisma.post.create({
      data: { ...data, authorId: userId! },
      select: { ...select, id: true },
    })) as any

    // Publish Data
    if (data.published) {
      pubSub.publish(Topics.Posts, {
        mutation: CREATED,
        id: newPost.id,
        authorId: userId,
      } as PublishedData)
    }

    const followers = (
      await prisma.follower.findMany({
        where: { followed_userId: userId },
        select: { id: true },
      })
    ).map((e: any) => e.id)

    // notify({
    //   arrayOfNotifiedUsers: followers,
    //   type: NotificationTypes.heartOnPost,
    //   url: `/newPosts`,
    //   firedNotificationUserId: userId!,
    // })

    return newPost
  }
}

export { CreatePostResolver }
