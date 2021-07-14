import jwt from 'jsonwebtoken'

export const genAccessToken = (id: string, tokenVersion: number) => {
  return jwt.sign({ id, tokenVersion }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15m',
  })
}
