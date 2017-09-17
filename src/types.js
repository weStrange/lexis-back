/* @flow */
'use strict'

export type Gender = 'Male' | 'Female' | 'Other'

export type CollectionName = 'User'

export type User = {
  email: string,
  firstName: string,
  lastName: string,
  registrationDate: string,
  birthday: string,
  gender: string
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

export type UserWithCreds = {
  email: string,
  firstName: string,
  lastName: string,
  registrationDate: string,
  birthday: string,
  gender: string,
  hash: string,
  salt: string
}

// TODO: fill this in
export type Course = {
  id: number,
  name: string
}

export type CollectionDataType = User | Course

export type CollectionData
= { type: 'user', payload: UserWithCreds }
| { type: 'course', payload: Course }
