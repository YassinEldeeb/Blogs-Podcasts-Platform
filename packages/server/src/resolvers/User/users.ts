import { MyContext } from '@Types/MyContext'
import { Prisma } from '@prisma/client'
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  Info,
  Query,
  Resolver,
} from 'type-graphql'
import { User } from '@models/User'
import { PaginationArgs } from '../shared/pagination'
import { Select } from '../shared/select/selectParamDecorator'
import { SortingArgs } from '../shared/sorting'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

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
    @Select() select: any,
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

    const users = await prisma.user.findMany({
      where,
      select,
      skip,
      take,
      orderBy,
      cursor: cursorId ? { id: cursorId } : undefined,
    })

    return users
  }
}

export { UsersResolver }
