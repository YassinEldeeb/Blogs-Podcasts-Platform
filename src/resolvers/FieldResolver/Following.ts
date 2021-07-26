import { Follower } from '@/models/Follower'
import { User } from '@/models/User'
import { MyContext } from '@/types/MyContext'
import { FieldResolver, Root, Args, Arg, Ctx, Resolver } from 'type-graphql'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'
import { SortingArgs } from '../shared/sorting'

@Resolver((_of) => User)
class UserFollowingFieldResolver {
  @FieldResolver((_type) => [Follower])
  async following(
    @Root() user: User,
    @Args() { skip, take, cursorId }: PaginationArgs,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
    @Ctx() { followingLoader }: MyContext,
    @Select({}, false) select: any
  ) {
    return followingLoader.load({
      id: user.id,
      select,
      args: { take, skip, cursorId, orderBy },
    })
  }
}
