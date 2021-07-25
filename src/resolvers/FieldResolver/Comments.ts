import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  FieldResolver,
  Resolver,
  Root,
} from 'type-graphql'
import { User } from '@/models/User'
import { MyContext } from '@/types/MyContext'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'
import { SortingArgs } from '../shared/sorting'

@ArgsType()
class CommentsInput extends PaginationArgs {}

@Resolver((_of) => User)
class CommentsFieldResolver {
  @FieldResolver()
  comments(
    @Root() user: User,
    @Args() { take, skip, cursorId }: CommentsInput,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
    @Ctx() { commentsLoader }: MyContext,
    @Select() select: any
  ) {
    return commentsLoader.load({
      id: user.id,
      select,
      args: { take, skip, cursorId, orderBy },
    })
  }
}

export { CommentsFieldResolver }
