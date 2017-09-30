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
  description: {
    type: String,
    required: false
  },
  lessons: {
    type: [lessonSchema]
  },
  image: {
    type: Buffer
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
  },
  image: {
    type: Buffer
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
  description: {
    type: String,
    required: false
  },
  students: {
    type: [String],
    default: []
  },
  levels: {
    type: [levelSchema]
  },
  achievements: {
    type: [achievementSchema]
  },
  imageUrl: {
    type: String
  },
  difficulty: String
})
courseSchema.methods.removeStudent = async function(email, cb) {
  let user = await mongoose.model('User').findOne({ email })
  user.courses = user.courses.filter(c => c !== this._id)
  this.students = this.students.filter(s => s !== email)
  return Promise.all([this.save(), user.save()])
}
courseSchema.methods.addStudent = async function(email, cb) {
  let user = await mongoose.model('User').findOne({ email })

  if (
    user.courses.filter(c => c === this._id).length > 0 ||
    this.students.filter(s => s === email).length > 0
  ) {
    throw new Error('The student already subscribed to the course')
  }

  user.courses.push(this._id)
  this.students.push(user.email)
  return Promise.all([this.save(), user.save()])
}

export default mongoose.model('Course', courseSchema)
