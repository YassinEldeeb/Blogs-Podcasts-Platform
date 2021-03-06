import { followersLoader } from '@data-loaders/FollowersLoader'
import { Follower } from '@models/Follower'
import { User } from '@models/User'
import { FieldResolver, Root, Args, Arg, Ctx, Resolver } from 'type-graphql'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'
import { SortingArgs } from '../shared/sorting'

@Resolver((_of) => User)
class UserFollowersFieldResolver {
  @FieldResolver((_type) => [Follower])
  async followers(
    @Root() user: User,
    @Args() { skip, take, cursorId }: PaginationArgs,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
    @Select({}, false) select: any,
  ) {
    return followersLoader.load({
      id: user.id,
      select,
      args: { take, skip, cursorId, orderBy },
    })
  }
}

export { UserFollowersFieldResolver }
