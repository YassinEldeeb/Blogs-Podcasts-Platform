import { Arg, Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Auth } from '../../middleware/Auth'
import { Post } from '../../models/Post'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/select/selectParamDecorator'

@Resolver()
class PostResolver {
  @Query(() => Post)
  @UseMiddleware(Auth({ throwError: false }))
  async post(
    @Arg('id') id: string,
    @Ctx() { prisma, userId }: MyContext,
    @Select() select: any
  ): Promise<Post[]> {
    const post = (await prisma.post.findFirst({
      where: {
        OR: [
          {
            id,
            published: true,
          },
          {
            id,
            authorId: userId ? userId : '',
          },
        ],
      },
      select,
    })) as any

    if (!post) {
      throw new Error('Post not found!')
    }

    return post
  }
}

export { PostResolver }
