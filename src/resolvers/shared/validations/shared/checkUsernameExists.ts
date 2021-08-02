import { prisma } from '@/prisma'

export const checkUsernameExistance = (
  username: string,
  isProblem: boolean = false
) => {
  return prisma.user
    .findUnique({
      where: { username },
      select: {
        id: true,
      },
    })
    .then((user) => {
      if ((user && !isProblem) || (!user && isProblem)) return true
      return false
    })
}
