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
    type: [String]
  },
  levels: {
    type: [levelSchema]
  },
  achievements: {
    type: [achievementSchema]
  },
  image: {
    type: Buffer
  },
  difficulty: String
})
courseSchema.methods.removeStudent = async function(email, cb) {
  let user = await mongoose.model('User').findOne({ email })
  user.courses = user.courses.filter(c => c.name === this.name)
  this.students = this.students.filter(s => s.email !== email)
  return Promise.all([this.save(), user.save()])
}
courseSchema.methods.addStudent = async function(email, cb) {
  let user = await mongoose.model('User').findOne({ email })
  user.courses.push(this.name)
  this.students.push(user.email)
  return Promise.all([this.save(), user.save()])
}

export default mongoose.model('Course', courseSchema)
