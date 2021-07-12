import { PrismaSelect } from '@paljs/plugins'
import { GraphQLResolveInfo } from 'graphql'
import {
  Resolver,
  Mutation,
  Ctx,
  Info,
  Arg,
  PubSub,
  PubSubEngine,
} from 'type-graphql'
import { ctx } from '../../types/ctx'
import { CreateCommentInput } from './createComment/CreateCommentInput'
import { Comment } from '../../models/Comment'
import { Topics } from '../../enums/subscriptions'
import { MutationType } from '../../enums/mutationType'
import { PublishedData } from '../shared/subscription/PublishedData'
import { Select } from '../shared/selectParamDecorator'

const { CREATED } = MutationType
const { CommentsOnPost } = Topics

@Resolver()
class CreateCommentResolver {
  @Mutation((_returns) => Comment)
  async createComment(
    @Arg('data') data: CreateCommentInput,
    @Ctx() { prisma }: ctx,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Comment> {
    const newComment = (await prisma.comment.create({
      data,
      select: { ...select, id: true },
    })) as any

    // Publish Data
    pubSub.publish(`${CommentsOnPost}:${data.postId}`, {
      mutation: CREATED,
      id: newComment.id,
    } as PublishedData)

    return newComment
  }
}

export { CreateCommentResolver }
