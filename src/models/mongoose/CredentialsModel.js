/* @flow */
'use strict'

import mongoose from 'mongoose'
import crypto from 'crypto'
// const jwt = require('koa-jwt')

var credentialsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  hash: String,
  salt: String
})
/*
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64)
    .toString('hex')
}

userSchema.methods.validatePassport = function (password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64)

  return this.hash === hash
}
*/
/*
userSchema.methods.generateJwt = function () {
  let expiry = new Date()
  expiry.setDate(expiry.getTime() + 1000 * 60 * 20) // set expiry to 20 minutes

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000)
  }, process.env.JWT_SECRET)
}
*/
export default mongoose.model('Credentials', credentialsSchema)
