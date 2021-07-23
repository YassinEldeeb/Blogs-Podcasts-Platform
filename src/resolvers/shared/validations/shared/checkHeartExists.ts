import { prisma } from '../../../../prisma'

export const checkHeartExistance = (id: string) => {
  return prisma.heart
    .findFirst({
      where: { id },
    })
    .then((comment) => {
      if (comment) return true
      return false
    })
}
