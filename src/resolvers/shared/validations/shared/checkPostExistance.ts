import { prisma } from '@/prisma'

export const checkPostExistance = (id: string, published?: boolean) => {
  return prisma.post
    .findFirst({
      where: published === undefined ? { id } : { id, published: published },
      select: {
        id: true,
      },
    })
    .then((post) => {
      if (post) return true
      return false
    })
}
