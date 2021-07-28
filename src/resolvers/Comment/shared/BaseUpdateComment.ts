import { Auth } from '@/middleware/Auth'
import { IsOwner } from '@/middleware/IsOwner'
import { Reply } from '@/models/Reply'
import { Select } from '@/resolvers/shared/select/selectParamDecorator'
import { PublishedData } from '@/resolvers/shared/subscription/PublishedData'
import { models } from '@/types/enums/models'
import { MutationType } from '@/types/enums/mutationType'
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
import { UpdateCommentInput } from '../updateComment/UpdateCommentInput'

const { UPDATED } = MutationType
const { CommentsOnPost } = Topics

export function updateCommentOrReplyBase<T extends ClassType>(
  suffix: 'Reply' | 'Comment',
  returnType: T
) {
  @Resolver()
  class BaseResolver {
    @Mutation((_type) => returnType, { name: `update${suffix}` })
    @UseMiddleware(Auth())
    @IsOwner(
      //@ts-ignore
      models[suffix.toLowerCase()]
    )
    async updateBase(
      @Arg('id') id: string,
      @Arg('data') data: UpdateCommentInput,
      @Ctx() { prisma }: MyContext,
      @PubSub() pubSub: PubSubEngine,
      @Select() select: any
    ): Promise<T> {
      //@ts-ignore
      const updatedCommentOrReply = (await prisma[suffix.toLowerCase()].update({
        where: { id },
        data,
        select: { ...select, id: true, postId: true },
      })) as any

      // Publish Data
      pubSub.publish(`${CommentsOnPost}:${updatedCommentOrReply.postId}`, {
        mutation: UPDATED,
        id: updatedCommentOrReply.id,
      } as PublishedData)

      return updatedCommentOrReply
    }
  }

  return BaseResolver
}
