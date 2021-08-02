import { sendRefreshToken } from '@/auth/sendRefreshToken'
import { genRefreshToken } from '@/auth/utils/genRefreshToken'
import { prisma } from '@/prisma'
import express from 'express'
import passport from 'passport'

const githubOAuthRouter = express.Router()

githubOAuthRouter.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

githubOAuthRouter.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    const profile: any = req.user
    let user: any

    // Successful authentication, redirect home.
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { githubId: profile.id },
          { email: profile.emails ? profile.emails![0].value : '' },
        ],
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.emails[0].value,
          githubId: profile.id,
          name: profile.displayName,
          bio: profile._json.bio,
          username: profile.displayName.toLowerCase().replace(' ', ''),
          confirmed: true,
          profilePic: profile._json.avatar_url,
        },
      })
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { githubId: profile.id },
      })
    }

    const refreshToken = await genRefreshToken(user.id, user.tokenVersion)

    sendRefreshToken(res, refreshToken)

    res.redirect(`${process.env.SERVER_URL!}/successful`)
  }
)

export { githubOAuthRouter }
