import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql'
import { User } from '@models/User'
import { MyContext } from '@Types/MyContext'

@Resolver((_of) => User)
class EmailResolver {
  @FieldResolver()
  email(@Root() user: User, @Ctx() { userId }: MyContext) {
    if (userId === user.id) {
      return user.email
    }
    return null
  }
}

export { EmailResolver }
