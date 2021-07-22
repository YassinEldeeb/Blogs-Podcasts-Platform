import { Prisma } from '@prisma/client'
import { Arg, Args, ArgsType, Ctx, Field, Query, Resolver } from 'type-graphql'
import { User } from '../../models/User'
import { MyContext } from '../../@types/MyContext'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'
import { SortingArgs } from '../shared/sorting'

@ArgsType()
class UsersInput extends PaginationArgs {
  @Field({ nullable: true })
  searchQuery?: string
}

@Resolver()
class UsersResolver {
  @Query((_returns) => [User])
  async users(
    @Args() { searchQuery, skip, take, cursorId }: UsersInput,
    @Arg('orderBy', { nullable: true }) orderBy: SortingArgs,
    @Ctx() { prisma }: MyContext,
    @Select() select: any
  ) {
    let where: Prisma.UserWhereInput = {}
    const query = searchQuery?.toLowerCase()

    if (query) {
      where = {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      }
    }
    console.time('Get Users')

    const users = await prisma.user.findMany({
      where,
      select,
      skip,
      take,
      orderBy,
      cursor: cursorId ? { id: cursorId } : undefined,
    })

    console.timeEnd('Get Users')
    return users
  }
}

export { UsersResolver }
