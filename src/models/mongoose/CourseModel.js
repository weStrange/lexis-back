/* @flow */
'use strict'

import mongoose from 'mongoose'

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  data: {
    type: String,
    required: true
  }
})

const lessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  exercises: {
    type: [exerciseSchema]
  }
})

const levelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lessons: {
    type: [lessonSchema]
  }
})

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['GENERAL', 'COURSE'],
    required: true
  },
  condition: {
    type: String,
    required: true
  }
})

const courseSchema = new mongoose.Schema({
  creatorEmail: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  students: {
    type: [String]
  },
  levels: {
    type: [levelSchema]
  },
  achievements: {
    type: [achievementSchema]
  }
})

export default mongoose.model('Course', courseSchema)
