import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql'
import { User } from '../../models/User'
import { MyContext } from '../../types/MyContext'
import { Select } from '../shared/select/selectParamDecorator'

@Resolver((_of) => User)
class PostsResolver {
  @FieldResolver()
  posts(
    @Root() user: User,
    @Ctx() { postsLoader }: MyContext,
    @Select() select: any
  ) {
    return postsLoader.load({ id: user.id, select })
  }
}

export { PostsResolver }
