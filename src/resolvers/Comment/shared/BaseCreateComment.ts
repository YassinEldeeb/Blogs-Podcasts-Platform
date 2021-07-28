import { Auth } from '@/middleware/Auth'
import { CREATED } from '@/types/enums/mutationType'
import { Topics } from '@/types/enums/subscriptions'
import { MyContext } from '@/types/MyContext'
import {
  Arg,
  ClassType,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { Select } from '../../shared/select/selectParamDecorator'
import { PublishedData } from '../../shared/subscription/PublishedData'

const { CommentsOnPost, CommentsOnMyPosts } = Topics

export function createCommentOrReplyBase<
  T extends ClassType,
  I extends ClassType
>(suffix: 'Reply' | 'Comment', returnType: T, input: I) {
  @Resolver()
  class BaseResolver {
    @Mutation((_type) => returnType, { name: `create${suffix}` })
    @UseMiddleware(Auth())
    async createBase(
      @Arg('data', () => input) data: any,
      @Ctx() { prisma, userId }: MyContext,
      @PubSub() pubSub: PubSubEngine,
      @Select() select: any
    ): Promise<T> {
      //@ts-ignore
      const newCommentOrReply = (await prisma[suffix.toLowerCase()].create({
        data: { ...data, authorId: userId! },
        select: { ...select, id: true, post: { select: { authorId: true } } },
      })) as any
      await prisma.post.update({
        where: { id: data.postId },
        data: { comments_count: { increment: 1 } },
      })

      // Publish Data
      pubSub.publish(`${CommentsOnPost}:${data.postId}`, {
        mutation: CREATED,
        id: newCommentOrReply.id,
      } as PublishedData)

      pubSub.publish(
        `${CommentsOnMyPosts}:${newCommentOrReply.post.authorId}`,
        {
          mutation: CREATED,
          id: newCommentOrReply.id,
          authorId: userId,
        } as PublishedData
      )

      return newCommentOrReply
    }
  }

  return BaseResolver
}
