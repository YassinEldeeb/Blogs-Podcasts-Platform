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
import { Post } from '../../models/Post'
import { GraphQLResolveInfo } from 'graphql'
import { CreatePostInput } from './createPost/CreatePostInput'
import { PrismaSelect } from '@paljs/plugins'
import { MutationType } from '../../enums/mutationType'
import { Topics } from '../../enums/subscriptions'
import { PublishedData } from '../shared/subscription/PublishedData'
import { Select } from '../shared/selectParamDecorator'

const { CREATED } = MutationType
const { Posts } = Topics

@Resolver()
class CreatePostResolver {
  @Mutation((_returns) => Post)
  async createPost(
    @Arg('data') data: CreatePostInput,
    @Ctx() { prisma }: ctx,
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
