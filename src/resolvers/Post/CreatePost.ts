import {
  Arg,
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
import { CreatePostInput } from './createPost/CreatePostInput'

const { CREATED } = MutationType
const { Posts } = Topics

@Resolver()
class CreatePostResolver {
  @Mutation((_returns) => Post)
  async createPost(
    @Arg('data') data: CreatePostInput,
    @Ctx() { prisma }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Select() select: any
  ) {
    const newPost = (await prisma.post.create({
      data,
      select: { ...select, id: true },
    })) as any

    if (data.published) {
      // Publish Data
      pubSub.publish(Posts, {
        mutation: CREATED,
        id: newPost.id,
      } as PublishedData)
    }

    return newPost
  }
}

export { CreatePostResolver }
