import { Response } from 'express'

export const sendRefreshToken = (res: Response, refreshToken: string) => {
  res.cookie('jid', refreshToken, {
    httpOnly: true,
    path: '/refresh_token',
    secure: process.env.SERVER_URL!.includes('https') ? true : false,
  })
}
