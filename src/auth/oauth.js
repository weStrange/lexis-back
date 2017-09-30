/* @flow */
'use strict'

import jwt from 'jsonwebtoken'
import promisify from 'es6-promisify'
import crypto from 'crypto'

import config from '~/config'

import type { InputCreds } from '~/types'

const signAsync = promisify(jwt.sign, jwt)

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

    const accessTokenOpts = Object.assign({}, {
      expiresIn: auth.accessTokenTtl
    }, opts)

    const accessToken = await signAsync({ email: payload.email }, secret, accessTokenOpts)

    return Promise.resolve({
      accessToken
    })
  } catch (e) {
    return Promise.reject(e)
  }
}
