import jwt from 'jsonwebtoken'

export const genAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '10m',
  })
}
