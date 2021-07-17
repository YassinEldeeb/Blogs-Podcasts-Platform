import DataLoader from 'dataloader'
import { Post } from '../models/Post'
import { prisma } from '../prisma'

interface data {
  id: string
  select: any
}

const batchPosts: any = async (data: data[]) => {
  const ids = data.map((e) => e.id)
  const select = data[0].select
  select.authorId = true

  const posts = (await prisma.post.findMany({
    where: { authorId: { in: ids }, published: true },
    select,
  })) as Post[]

  const postsMap: any = []

  posts.forEach((post: Post) => {
    if (postsMap[post.authorId]) {
      postsMap[post.authorId].push(post)
    } else {
      postsMap[post.authorId] = [post]
    }
  })

  return ids.map((e: any) => postsMap[e] || [])
}

export const postsLoader = () => new DataLoader<data, Post>(batchPosts)
