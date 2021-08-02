import express from 'express'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'

const githubStrategyRouter = express.Router()

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!.replace('\n', ''),
      clientSecret: process.env.GITHUB_CLIENT_SECRET!.replace('\n', ''),
      callbackURL: `${process.env.SERVER_URL!.replace(
        '\n',
        ''
      )}/auth/github/callback`,
      scope: ['user:email'],
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const user = profile
      done(null, user)
    }
  )
)

export { githubStrategyRouter }
