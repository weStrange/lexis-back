/* @flow */
'use strict'

import mongoose from 'mongoose'
// const crypto = require('crypto')
// const jwt = require('koa-jwt')

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
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
    required: true
  },
  birthday: Date,
  gender: String,
  avatar: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: true
  },
  course: {
    type: [String],
    require: true,
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
export default mongoose.model('User', userSchema)
