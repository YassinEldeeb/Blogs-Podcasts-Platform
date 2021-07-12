import {
  Resolver,
  Mutation,
  Info,
  Ctx,
  Arg,
  Args,
  PubSub,
  PubSubEngine,
} from 'type-graphql'
import { Post } from '../../models/Post'
import { PrismaSelect } from '@paljs/plugins'
import { GraphQLResolveInfo } from 'graphql'
import { ctx } from '../../types/ctx'
import { UpdatePostInput } from './updatePost/UpdatePostInput'
import { PostIdInput } from './shared/PostIdExists'
import { MutationType } from '../../enums/mutationType'
import { Topics } from '../../enums/subscriptions'
import { PublishedData } from '../shared/subscription/PublishedData'
import { Select } from '../shared/selectParamDecorator'

const { CREATED, UPDATED, DELETED } = MutationType
const { Posts } = Topics

@Resolver()
class UpdatePostResolver {
  @Mutation((_returns) => Post)
  async updatePost(
    @Args() { id }: PostIdInput,
    @Arg('data') data: UpdatePostInput,
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { prisma }: ctx,
    @Select() select: any
  ): Promise<Post> {
    const originalPost = (await prisma.post.findUnique({
      where: { id },
      select: { published: true },
    })) as any

    const updatedPost = (await prisma.post.update({
      where: { id },
      data,
      select: { ...select, id: true },
    })) as any

    // Publish Data
    if (data.published && originalPost.published === false) {
      pubSub.publish(Posts, {
        mutation: CREATED,
        id: updatedPost.id,
      } as PublishedData)
    } else if (data.published === false && originalPost.published) {
      pubSub.publish(Posts, {
        mutation: DELETED,
        id: updatedPost.id,
      } as PublishedData)
    } else {
      pubSub.publish(Posts, {
        mutation: UPDATED,
        id: updatedPost.id,
      } as PublishedData)
    }

    return updatedPost
  }
}

export { UpdatePostResolver }
