import {
  Arg,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { CREATED } from '../../@types/enums/mutationType'
import { MyContext } from '../../@types/MyContext'
import { Auth } from '../../middleware/Auth'
import { Post } from '../../models/Post'
import { Select } from '../shared/select/selectParamDecorator'
import { PublishedData } from '../shared/subscription/PublishedData'
import { CreatePostInput } from './createPost/CreatePostInput'

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
    const newPost = (await prisma.post.create({
      data: { ...data, authorId: userId! },
      select: { ...select, id: true },
    })) as any

    if (data.published) {
      // Publish Data
      pubSub.publish('Posts', {
        mutation: CREATED,
        id: newPost.id,
      } as PublishedData)
    }

    return newPost
  }
}

export { CreatePostResolver }
