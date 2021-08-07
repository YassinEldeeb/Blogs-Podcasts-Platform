import express from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '@/prisma'
import { genTokens } from '../genTokens'
import { sendRefreshToken } from '../sendRefreshToken'

const refreshTokenRouter = express.Router()

refreshTokenRouter.post('/refresh_token', async (req, res) => {
  const token = req.cookies.jid

  if (!token) {
    return res.send({ ok: false, accessToken: '' })
  }

  let payload: any = null
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!)
  } catch (error: any) {
    console.log(error.message)
    return res.send({ ok: false, accessToken: '' })
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, tokenVersion: true },
  })

  if (!user || user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: '' })
  }

  const { accessToken, refreshToken } = await genTokens(
    payload.id,
    user.tokenVersion
  )

  sendRefreshToken(res, refreshToken)

  return res.send({ ok: true, accessToken })
})

export { refreshTokenRouter }
