import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  test?: string

  @Field()
  name: string

  @Field({ nullable: true })
  username?: string

  @Field()
  email: string

  password?: string

  @Field({ nullable: true })
  bio?: string

  tokenVersion: number

  confirmed: boolean

  @Field({ nullable: true })
  profilePic?: string

  @Field(() => [Post])
  posts: Post[]

  @Field(() => [Comment])
  comments: Comment[]

  hearts: Heart[]

  @Field()
  followers_count: number

  @Field()
  following_count: number

  @Field(() => [Follower])
  followers: Follower[]

  @Field(() => [Follower])
  following: Follower[]

  @Field(() => [Notification])
  notifications: Notification[]

  notificationsFromUser: NotificationFromUser[]

  notificationsFromUserWhoFired: NotificationFromUser[]

  @Field({ nullable: true })
  githubId?: string

  @Field({ nullable: true })
  lastTimelineVisit?: Date

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@ObjectType()
export class Follower {
  @Field(() => ID)
  id: string

  followed_userId: string

  follower_userId: string

  @Field()
  followed_user: User

  @Field()
  follower_user: User

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string

  @Field(() => [String])
  tags: string[]

  @Field()
  published: boolean

  @Field(() => [Heart])
  hearts: Heart[]

  @Field()
  hearts_count: number

  @Field()
  comments_count: number

  authorId: string

  @Field()
  author: User

  @Field(() => [Comment])
  comments: Comment[]

  @Field()
  readingTimeTxt: string

  @Field()
  readingTimeMin: number

  @Field({ nullable: true })
  coverImg?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string

  @Field()
  notifiedUser: User

  notifiedUserId: string

  @Field(() => [NotificationFromUser])
  fromUsers: NotificationFromUser[]

  @Field()
  seen: boolean

  @Field()
  message: string

  @Field()
  type: NotificationType

  @Field()
  url: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

enum NotificationType {
  newPosts = 'newPosts',
  newComments = 'newComments',
  newFollowers = 'newFollowers',
  reply = 'reply',
  heartOnPost = 'heartOnPost',
  heartOnComment = 'heartOnComment',
  heartOnReply = 'heartOnReply',
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
})

@ObjectType()
export class NotificationFromUser {
  @Field(() => ID)
  id: string

  @Field()
  user: User

  @Field()
  userWhoFired: User

  notification?: Notification

  @Field()
  userId: string

  @Field()
  userWhoFiredId: string

  notificationId?: string
}

@ObjectType()
export class Heart {
  @Field(() => ID)
  id: string

  @Field()
  user: User

  @Field({ nullable: true })
  post?: Post

  @Field({ nullable: true })
  comment?: Comment

  authorId: string

  postId?: string

  commentId?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string

  @Field()
  text: string

  @Field()
  author: User

  @Field()
  post: Post

  authorId: string

  postId: string

  @Field(() => [Heart])
  hearts: Heart[]

  @Field()
  hearts_count: number

  @Field({ nullable: true })
  parentId?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
