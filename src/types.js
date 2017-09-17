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


export type CollectionData
= { type: 'user', payload: User }
| { type: 'credentials', payload: Credentials }
