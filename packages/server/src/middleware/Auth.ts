import jwt from 'jsonwebtoken'
import { MiddlewareFn } from 'type-graphql'
import { prisma } from '@prismaInstance'
import { MyContext } from '@Types/MyContext'

const authFailed = (throwError: boolean = true, next: any) => {
  if (throwError) {
    throw new Error('Not authenticated!')
  }
  return next()
}

export function Auth(options?: {
  throwError: boolean
}): MiddlewareFn<MyContext> {
  return async ({ context }, next) => {
    const throwError = options?.throwError
    const authorization = context.req.headers['authorization']

    if (!authorization) {
      context.userId = undefined
      return authFailed(throwError, next)
    }

    try {
      const token = authorization!.split(' ')[1]
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { tokenVersion: true },
      })

      if (!user || payload.tokenVersion !== user.tokenVersion) {
        context.userId = undefined
        return authFailed(throwError, next)
      }

      context.userId = payload.id
    } catch (error: any) {
      console.log(error.message)
      context.userId = undefined
      return authFailed(throwError, next)
    }
    return next()
  }
}
