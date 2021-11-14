import { User } from '@models/User'
import { FieldResolver, Resolver, Root } from 'type-graphql'

@Resolver((_of) => User)
class SayHello {
  @FieldResolver()
  sayHello(@Root() user: User) {
    return `Hello ${user.name}`
  }
}

export { SayHello }
