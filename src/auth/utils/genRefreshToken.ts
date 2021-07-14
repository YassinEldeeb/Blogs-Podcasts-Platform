import jwt from 'jsonwebtoken'

export const genRefreshToken = (id: string, tokenVersion: number) => {
  return jwt.sign({ id, tokenVersion }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d',
  })
}
