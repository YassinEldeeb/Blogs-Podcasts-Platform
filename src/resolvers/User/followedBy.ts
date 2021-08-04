import { followedByLoader } from '@/data-loaders/explicit-cases/followedBy'
import { Auth } from '@/middleware/Auth'
import { Follower } from '@/models/Follower'
import { User } from '@/models/User'
import { MyContext } from '@/types/MyContext'
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'
import { SortingArgs } from '../shared/sorting'

@Resolver((_of) => User)
class followedByResolver {
  @FieldResolver((_type) => [Follower])
  @UseMiddleware(Auth())
  async followedBy(
    @Root() user: User,
    @Args() { skip, take, cursorId }: PaginationArgs,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
    @Ctx() { userId }: MyContext,
    @Select() select: any
  ): Promise<Follower[]> {
    return followedByLoader.load({
      id: user.id,
      followed_userId: user.id,
      userId: userId!,
      select,
      args: { take, skip, cursorId, orderBy },
    })
  }
}

export { followedByResolver }
