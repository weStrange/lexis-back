// import jwt from 'jsonwebtoken'
// import promisify from 'es6-promisify'
// import crypto from 'crypto'

import config from '~/config'
import { promisify } from 'util'
import _ from 'lodash'

import mongoose from 'mongoose'
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// convert the async version of method "sign" of JWT to use return Promise instead of callback
const signAsync = promisify(jwt.sign, jwt)

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  birthday: Date,
  gender: String,
  role: {
    type: String,
    required: true,
    default: 'Student'
  },
  avatarUrl: String,
  courses: [String],
  hash: String,
  salt: String
})

userSchema.methods.setPassword = function (password) {
  // password setting should be set directly on a schema because it has direct assess in the document and user credentials are not tossed around - leaving surface for bugs and vulnerability
  let salt = crypto.randomBytes(16).toString('hex')
  let hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')
  this.hash = hash
  this.salt = salt
}

userSchema.methods.validatePassword = function (password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex')
  return this.hash === hash
}

userSchema.methods.generateJwt = async function (additionalConfig: any) {
  // retrieve configuration for jwt from a configuration file
  // jwtConfig has a general configuration object for "sign" methods
  // keys holds all keys of application data. A Jwt secret is stored there and retrieved here
  const { jwtConfig, keys } = config
  const accessToken = await signAsync({ email: this.email }, keys.session, {
    ...jwtConfig,
    ...additionalConfig
  })
  return accessToken
}

userSchema.set('toJSON', {
  // we would like to control what gets serialized in toJson.
  // because typically, you would use this function to return data to a API response.
  // instead of manually strip down everytime unwanted data in your controller, it is more convenient to do it here
  transform: function (doc, ret, options) {
    // you might wonder why its lengthy, but actually people recommend whitelisting instead of blacklisting
    const whiteList = [
      'email',
      'firstname',
      'lastname',
      'registrationDate',
      'birthday',
      'gender',
      'role',
      'avatarUrl',
      'courses'
    ]
    const toBeReturned = _.pick(ret, whiteList)
    return toBeReturned
  }
})

export default mongoose.model('User', userSchema)
