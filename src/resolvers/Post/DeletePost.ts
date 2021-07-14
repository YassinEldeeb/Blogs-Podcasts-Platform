import {
  Args,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
} from 'type-graphql'
import { MutationType } from '../../enums/mutationType'
import { Topics } from '../../enums/subscriptions'
import { Post } from '../../models/Post'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { PostIdInput } from './shared/PostIdExists'

const { DELETED } = MutationType
const { Posts } = Topics

@Resolver()
class DeletePostResolver {
  @Mutation(() => Post)
  async deletePost(
    @Args() { id }: PostIdInput,
    @Ctx() { prisma }: MyContext,
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
