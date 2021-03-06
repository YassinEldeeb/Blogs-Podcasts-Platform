import { prisma } from '@prismaInstance'
import express from 'express'
import passport from 'passport'
import { genRefreshToken } from '@auth/utils/genRefreshToken'
import { sendRefreshToken } from '@auth/sendRefreshToken'

const githubOAuthRouter = express.Router()

githubOAuthRouter.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
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

    res.redirect(`http://127.0.0.1:5500/success.html`)
  },
)

export { githubOAuthRouter }
