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
  role: {
    type: String,
    required: true,
    default: 'Student'
  },
  avatarUrl: {
    type: String,
    required: false
  },
  courses: {
    type: [String],
    default: []
  },
  hash: String,
  salt: String
})

export default mongoose.model('User', userSchema)
