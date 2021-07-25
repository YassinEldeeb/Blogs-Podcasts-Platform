import { Follower } from '@/models/Follower'
import { User } from '@/models/User'
import { MyContext } from '@/types/MyContext'
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  FieldResolver,
  Resolver,
  Root,
} from 'type-graphql'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'
import { SortingArgs } from '../shared/sorting'

@ArgsType()
class FollowersInput extends PaginationArgs {}

@Resolver((_of) => User)
class BaseFollowerResolver {
  @FieldResolver((_type) => [Follower])
  async followers(
    @Root() user: User,
    @Args() { take, skip, cursorId }: FollowersInput,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
    @Ctx() { followersLoader }: MyContext,
    @Select() select: any
  ) {
    return followersLoader.load({
      id: user.id,
      select,
      args: { take, skip, cursorId, orderBy },
    })
  }
}

export { BaseFollowerResolver }
