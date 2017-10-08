/* @flow */
'use strict'

import mongoose from 'mongoose'

const levelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  // this is just s tring JSON that is only handled on the front-end
  lessons: {
    type: String,
    default: '[]'
  },
  imageUrl: {
    type: String
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
courseSchema.methods.removeStudent = async function (email, cb) {
  let user = await mongoose.model('User').findOne({ email })
  console.log(this._id.toString())
  console.log(user.courses.filter(c => c.course !== this._id.toString()))
  user.courses = user.courses.filter(c => c.course !== this._id.toString())
  this.students = this.students.filter(s => s !== email)
  return Promise.all([this.save(), user.save()])
}
courseSchema.methods.addStudent = async function (email, cb) {
  let user = await mongoose.model('User').findOne({ email })

  if (
    user.courses.filter(c => c.course === this._id).length > 0 ||
    this.students.filter(s => s === email).length > 0
  ) {
    throw new Error('The student already subscribed to the course')
  }

  user.courses.push({ course: this._id, progress: 0 })
  this.students.push(user.email)
  return Promise.all([this.save(), user.save()])
}

export default mongoose.model('Course', courseSchema)
