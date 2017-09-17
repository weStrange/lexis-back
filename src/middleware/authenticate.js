/* @flow */
'use strict'

const authRoutes = require('koa-router')()
const passport = require('../auth/passport')
let { generateTokens } = require('../auth/oauth')

let User = require('../models/User')

if (module.hot) {
  // $FlowIgnore
  module.hot.accept('../auth/oauth', () => {})
}

if (module.hot) {
  // $FlowIgnore
  module.hot.accept('../auth/passport', () => {})
}

function localAuthHandler (ctx: any, next: () => void) {
  return passport.authenticate('local', async (err, user, info) => {
    if (err) {
      ctx.throw(500, err)
    }

    if (user === false) {
      ctx.status = 401
      ctx.body = info.message
    } else {
      const { accessToken } = await generateTokens(
        {user},
        process.env['SESSION_SECRET'] || 'secret'
      )
      try {
        ctx.json({
          accessToken
          // refreshToken
        })
      } catch (e) {
        ctx.throw(500, e)
      }
    }
  })(ctx, next)
}

async function registrationHandler (ctx, next) {
  let { email } = ctx.request.body

  if (!(await User.findOne(email))) {
    let result = await User.insert(ctx.request.body)

    ctx.body = result.serialize(false)
  }

  return next()
}

module.exports = function authenticate () {
  // authRoutes.post('/login/callback', loginWithRemoteService); //return the token with information received from remote login provider
  authRoutes.post('/login', localAuthHandler)
  authRoutes.post('/register', registrationHandler)

  return authRoutes
}
