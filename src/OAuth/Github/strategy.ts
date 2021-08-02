import express from 'express'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'

const githubStrategyRouter = express.Router()

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL!}/auth/github/callback`,
      scope: ['user:email'],
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const user = profile
      done(null, user)
    }
  )
)

console.log({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: `${process.env.SERVER_URL!}/auth/github/callback`,
})

export { githubStrategyRouter }
