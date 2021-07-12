import { prisma } from '../../../../prisma'

export const checkPostExistance = (id: string) => {
  return prisma.post
    .findUnique({
      where: { id },
      select: {
        id: true,
      },
    })
    .then((post) => {
      if (post) return true
      return false
    })
}
