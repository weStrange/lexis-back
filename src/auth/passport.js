/* @flow */
'use strict'

import passport from 'koa-passport'
let LocalStrategy = require('passport-local').Strategy

import User from '../models/User'
import { validatePassword } from './oauth'

export default passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
  try {
    console.log('in strategy', email, password)
    let creds = await User.findCreds(email)
    console.log('in strategy', creds)
    if (creds === undefined || creds === null) {
      return done(null, false, {
        message: 'Incorrect username.'
      })
    }

    // console.log(user)
    if (!validatePassword(password, creds.hash, creds.salt)) {
      return done(null, false, {
        message: 'Incorrect password.'
      })
    }

    return done(null, creds)
  } catch (err) {
    return done(err)
  }
}))
