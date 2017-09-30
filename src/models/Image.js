/* @flow */
'use strict'

import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  img: {
    type: Buffer,
    required: false
  },
  mimetype: {
    type: String,
    required: false
  }
})

export default mongoose.model('Image', imageSchema)
