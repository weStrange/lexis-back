/* @flow */
'use strict'

import passport from 'koa-passport'
import dotenv from 'dotenv'
import passportLocal from 'passport-local'
import { User } from '~/models/'
// import { validatePassword } from "./oauth";

dotenv.config()

let LocalStrategy = passportLocal.Strategy

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

export default passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        let user = await User.findOne({ email })

        if (!user || !user.validatePassword(password)) {
          return done(null, false, {
            message: 'Incorrect username or password.'
          })
        }

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)
