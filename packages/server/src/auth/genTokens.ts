import { genAccessToken } from './utils/genAccessToken'
import { genRefreshToken } from './utils/genRefreshToken'

export const genTokens = async (userId: string, tokenVersion: number) => {
  const refreshToken = await genRefreshToken(userId, tokenVersion)
  const accessToken = await genAccessToken(userId, tokenVersion)

  return { accessToken, refreshToken }
}
