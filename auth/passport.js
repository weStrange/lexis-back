/* flow */
'use strict'

const passport = require('koa-passport')
let LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy((username: string, password: string, done: any) => {
  if (username === 'test' && password === 'test') {
    done(null, {
      username: 'test',
      verified: 'true'
    }, { message: 'Success' })
  } else if (username !== 'test' || password !== 'test') {
    done(null, false, { message: 'Incorrect username or password.' })
  }
}))

module.exports = passport
