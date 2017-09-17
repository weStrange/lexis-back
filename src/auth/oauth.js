/* @flow */
'use strict'

const jwt = require('jsonwebtoken')
const promisify = require('es6-promisify')
const config = require('../config')

// const redis = createClient()
// const redisSetexAsync = promisify(redis.setex, redis)
const signAsync = promisify(jwt.sign, jwt)
// const randomBytesAsync = promisify(crypto.randomBytes, crypto)
/*
const generateJwtId = async () => {
  try {
    let jti = await randomBytesAsync(32)
    return Promise.resolve(jti.toString('hex'))
  } catch (e) {
    return Promise.reject(e)
  }
}
*/
module.exports.generateTokens = async (
  payload: any,
  secret: string,
  opts: any = {}
) => {
  try {
    const { auth } = config

    // const accessTokenId = await generateJwtId()
    // const refreshTokenId = await generateJwtId()

    // const accessTokenPayload = Object.assign({}, payload, { jti: accessTokenId })
/*    const refreshTokenPayload = Object.assign({}, {
      jti: refreshTokenId,
      ati: accessTokenId
    }) */
/*
    const refreshTokenOpts = Object.assign({}, {
      expiresIn: auth.refreshTokenTtl
    }, opts) */
    const accessTokenOpts = Object.assign({}, {
      expiresIn: auth.accessTokenTtl
    }, opts)

    // const refreshToken = await signAsync(refreshTokenPayload, secret, refreshTokenOpts)
    const accessToken = await signAsync(payload, secret, accessTokenOpts)

    // await redisSetexAsync(refreshTokenId, auth.refreshTokenTtl, payload.user.username)
    // console.log('Here also')
    return Promise.resolve({
      accessToken
      // refreshToken
    })
  } catch (e) {
    return Promise.reject(e)
  }
}
