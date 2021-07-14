import jwt from 'jsonwebtoken'
import { MiddlewareFn } from 'type-graphql'
import { prisma } from '../prisma'
import { MyContext } from '../types/MyContext'

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.headers['authorization']

  if (!authorization) {
    throw new Error('not authenticated!')
  }

  try {
    const token = authorization!.split(' ')[1]
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { tokenVersion: true },
    })

    if (!user || payload.tokenVersion !== user.tokenVersion) {
      throw new Error('not authenticated!')
    }

    context.userId = payload.id
  } catch (error: any) {
    console.log(error.message)
    throw new Error('not authenticated!')
  }

  return next()
}
