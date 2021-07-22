import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Resolver,
  Root,
} from 'type-graphql'
import { User } from '../../models/User'
import { MyContext } from '../../@types/MyContext'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'
import { SortingArgs } from '../shared/sorting'

@ArgsType()
class PostsInput extends PaginationArgs {}

@Resolver((_of) => User)
class PostsResolver {
  @FieldResolver()
  posts(
    @Root() user: User,
    @Args() { take, skip, cursorId }: PostsInput,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
    @Ctx() { postsLoader }: MyContext,
    @Select() select: any
  ) {
    return postsLoader.load({
      id: user.id,
      select,
      args: { take, skip, cursorId, orderBy },
    })
  }
}

export { PostsResolver }
