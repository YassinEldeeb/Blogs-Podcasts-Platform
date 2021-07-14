import { buildSchema, MiddlewareFn } from 'type-graphql'
import { UsersResolver } from '../resolvers/User/users'
import { RegisterResolver } from '../resolvers/User/Register'
import { DeleteUserResolver } from '../resolvers/User/DeleteUser'
import { PostsResolver } from '../resolvers/Post/posts'
import { CreatePostResolver } from '../resolvers/Post/CreatePost'
import { DeletePostResolver } from '../resolvers/Post/DeletePost'
import { CommentsResolver } from '../resolvers/Comment/comments'
import { UpdateUserResolver } from '../resolvers/User/UpdateUser'
import { UpdatePostResolver } from '../resolvers/Post/UpdatePost'
import { CreateCommentResolver } from '../resolvers/Comment/CreateComment'
import { DeleteCommentResolver } from '../resolvers/Comment/DeleteComment'
import { UpdateCommentResolver } from '../resolvers/Comment/UpdateComment'
import { CommentsSubscriptionsResolver } from '../resolvers/Comment/Subscriptions'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { PostsSubscriptionsResolver } from '../resolvers/Post/Subscriptions'
import { LoginResolver } from '../resolvers/User/Login'
import { MeResolver } from '../resolvers/User/me'
import { RevokeResolver } from '../resolvers/User/revokeAllTokens'

export const createSchema = (pubSub: RedisPubSub) =>
  buildSchema({
    resolvers: [
      UsersResolver,
      RegisterResolver,
      DeleteUserResolver,
      PostsResolver,
      CreatePostResolver,
      DeletePostResolver,
      CommentsResolver,
      UpdateUserResolver,
      UpdatePostResolver,
      CreateCommentResolver,
      DeleteCommentResolver,
      UpdateCommentResolver,
      CommentsSubscriptionsResolver,
      PostsSubscriptionsResolver,
      LoginResolver,
      MeResolver,
      RevokeResolver,
    ],
    pubSub,
  })
