import { prisma } from '@/prisma'

export const checkUserExistance = (where: any, isProblem: boolean = false) => {
  return prisma.user
    .findUnique({
      where,
      select: {
        id: true,
      },
    })
    .then((user) => {
      if ((user && !isProblem) || (!user && isProblem)) return true
      return false
    })
}
