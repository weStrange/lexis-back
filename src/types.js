/* @flow */
'use strict'

import { List } from 'immutable'

export type Gender = 'Male' | 'Female' | 'Other'

export type Role = 'Teacher' | 'Student'

export type CollectionName = 'User'

export type User = {
  email: string,
  firstName: string,
  lastName: string,
  registrationDate: string,
  birthday: string,
  gender: string,
  role: Role,
  courses: List<string>,
  avatarUrl: ?string
}

export type Credentials = {
  email: string,
  hash: string,
  salt: string
}

export type InputCreds = {
  email: string,
  password: string
}

export type UserWithCreds =
  User & {
  hash: string,
  salt: string
}

export type Exercise = {
  id: string,
  name: string,
  data: string
}

export type Lesson = {
  id: string,
  name: string,
  exercises: List<Exercise>
}

export type Level = {
  id: string,
  name: string,
  lessons: List<Lesson>
}

export type Achievement = {
  id: string,
  name: string,
  type: 'GENERAL' | 'COURSE',
  condition: string
}

export type Course = {
  id: string,
  creatorEmail: string,
  name: string,
  students: List<string>,
  levels: List<Level>,
  achievements: List<Achievement>
}

export type Avatar = {
  email: string,
  img: ?Buffer,
  type: ?string
}

export type CollectionDataType = User | Course

export type CollectionData
  = { type: 'user', payload: UserWithCreds }
  | { type: 'course', payload: Course }
  | { type: 'avatar', payload: Avatar }
