import { Auth } from '@/middleware/Auth'
import { IsOwner } from '@/middleware/IsOwner'
import { Comment } from '@/models/Comment'
import { models } from '@/types/enums/models'
import { UPDATED } from '@/types/enums/mutationType'
import { Topics } from '@/types/enums/subscriptions'
import { MyContext } from '@/types/MyContext'
import {
  Mutation,
  UseMiddleware,
  Arg,
  Ctx,
  Resolver,
  PubSub,
  PubSubEngine,
} from 'type-graphql'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { UpdateCommentInput } from './updateComment/UpdateCommentInput'

@Resolver()
class UpdateComment {
  @Mutation((_type) => Comment)
  @UseMiddleware(Auth())
  @IsOwner(models.comment)
  async updateBase(
    @Arg('id') id: string,
    @Arg('data') data: UpdateCommentInput,
    @Ctx() { prisma, userId }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Comment> {
    const updatedComment = (await prisma.comment.update({
      where: { id },
      data,
      select: { ...select, id: true, postId: true },
    })) as any

    // Publish Data
    pubSub.publish(`${Topics.CommentsOnPost}:${updatedComment.postId}`, {
      mutation: UPDATED,
      id: updatedComment.id,
    } as PublishedData)

    return updatedComment
  }
}
