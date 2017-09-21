/* @flow */
'use strict'

import mongoose from 'mongoose'

const avatarSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  img: {
    type: Buffer,
    required: false
  },
  type: {
    type: String,
    required: false
  }
})

export default mongoose.model('Avatar', avatarSchema)
