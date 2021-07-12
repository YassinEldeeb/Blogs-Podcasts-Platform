import { PrismaSelect } from '@paljs/plugins'
import { GraphQLResolveInfo } from 'graphql'
import {
  Args,
  Ctx,
  Info,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
} from 'type-graphql'
import { ctx } from '../../types/ctx'
import { Post } from '../../models/Post'
import { PostIdInput } from './shared/PostIdExists'
import { MutationType } from '../../enums/mutationType'
import { Topics } from '../../enums/subscriptions'
import { PublishedData } from '../shared/subscription/PublishedData'
import { Select } from '../shared/selectParamDecorator'

const { DELETED } = MutationType
const { Posts } = Topics

@Resolver()
class DeletePostResolver {
  @Mutation(() => Post)
  async deletePost(
    @Args() { id }: PostIdInput,
    @Ctx() { prisma }: ctx,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ): Promise<Post> {
    const deletedPost = (await prisma.post.delete({
      where: { id },
      select: { ...select, id: true },
    })) as any

    // Publish Data
    pubSub.publish(Posts, {
      mutation: DELETED,
      id: deletedPost.id,
    } as PublishedData)

    return deletedPost
  }
}

export { DeletePostResolver }
