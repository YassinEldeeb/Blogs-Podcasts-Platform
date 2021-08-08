import express from 'express'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'

const githubStrategyRouter = express.Router()

const env = (envVar: string) => {
  return envVar.replace(/\n|\r/g, '')
}

passport.use(
  new GitHubStrategy(
    {
      clientID: env(process.env.GITHUB_CLIENT_ID!),
      clientSecret: env(process.env.GITHUB_CLIENT_SECRET!),
      callbackURL: `${env(process.env.SERVER_URL!)}/auth/github/callback`,
      scope: ['user:email'],
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const user = profile
      done(null, user)
    }
  )
)

export { githubStrategyRouter }
