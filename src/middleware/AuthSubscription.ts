import jwt from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'
import { prisma } from '../prisma'
import { MyContext } from '../types/MyContext'

export const authSubscription: AuthChecker<MyContext> = async (
  { context },
  _data
) => {
  if (!context.wsHeaders.authorization) {
    throw new Error('Not authenticated!')
  }
  try {
    const token = context.wsHeaders.authorization!.split(' ')[1]
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { tokenVersion: true },
    })

    if (!user || payload.tokenVersion !== user.tokenVersion) {
      context.userId = undefined
      throw new Error('Not authenticated!')
    }

    context.userId = payload.id
  } catch (error) {
    throw new Error('Not authenticated!')
  }
  return true
}
