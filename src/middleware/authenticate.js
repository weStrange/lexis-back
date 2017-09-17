/* @flow */
'use strict'

import getRouter from 'koa-router'
let authRoutes = getRouter()

import passport from '../auth/passport'
import { generateTokens, getHashAndSalt } from '../auth/oauth'

import User from '../models/User'
import Utils from '../utils'

import type {
  InputCreds,
  User as UserType,
  UserWithCreds,
  Credentials
} from '../types'

if (module.hot) {
  // $FlowIgnore
  module.hot.accept('../auth/oauth', () => {})
}

if (module.hot) {
  // $FlowIgnore
  module.hot.accept('../auth/passport', () => {})
}

function localAuthHandler (ctx: any, next: () => void) {
  return passport.authenticate('local', async (err, user: InputCreds, info) => {
    console.log('in authenticate', user, info)
    if (err) {
      ctx.throw(500, err)
    }

    if (user === false) {
      ctx.status = 401
      ctx.body = info.message
    } else {
      const { accessToken } = await generateTokens(
        user,
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
  let payload = ctx.request.body

  let newUser: UserType = {
    ...Utils.stripCreds(payload),
    registrationDate: (new Date()).toISOString()
  }
  let creds: Credentials = {
    email: payload.email,
    ...getHashAndSalt(payload.password)
  }

  if (!(await User.findOne({ email: payload.email }))) {

    let result = await User.insert(newUser, creds)

    ctx.body = result.serialize(false)
  }

  return next()
}


export default function authenticate () {
  // authRoutes.post('/login/callback', loginWithRemoteService); //return the token with information received from remote login provider
  authRoutes.post('/login', localAuthHandler)
  authRoutes.post('/register', registrationHandler)

  return authRoutes
}
