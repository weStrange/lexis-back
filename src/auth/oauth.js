/* @flow */
'use strict'

import jwt from 'jsonwebtoken'
import promisify from 'es6-promisify'
import crypto from 'crypto'

import config from '../config'

import type { InputCreds } from '../types'

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
export function validatePassword (
  password: string,
  existingHash: string,
  existingSalt: string
) {
  let hash = crypto.pbkdf2Sync(password, existingSalt, 1000, 64, 'sha512')
    .toString('hex')

  return existingHash === hash
}

export function getHashAndSalt (
  password: string
): { salt: string, hash: string } {
  let salt = crypto.randomBytes(16).toString('hex')
  let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')

  return { salt, hash }
}


export async function generateTokens (
  payload: InputCreds,
  secret: string,
  opts: any = {}
) {
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
    const accessToken = await signAsync({ email: payload.email }, secret, accessTokenOpts)

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
