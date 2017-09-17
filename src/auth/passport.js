/* @flow */
'use strict'

const crypto = require('crypto')
const passport = require('koa-passport')
let LocalStrategy = require('passport-local').Strategy

const User = require('../models/User')

passport.use(new LocalStrategy(async (email, password, done) => {
  try {
    let user = await User.find({ email })[0]

    if (!user) {
      return done(null, false, {
        message: 'Incorrect username.'
      })
    }
    // console.log(user)
    if (!validatePassword(password, user.hash, user.salt)) {
      return done(null, false, {
        message: 'Incorrect password.'
      })
    }

    return done(null, user)
  } catch (err) {
    return done(err)
  }
}))

function validatePassword (
  password,
  existingHash,
  existingSalt
) {
  let hash = crypto.pbkdf2Sync(password, existingSalt, 1000, 64)

  return existingHash === hash
}

module.exports = passport
