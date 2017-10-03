/* eslint { "global-require": 0 } */
/* @flow */
'use strict'

import type { UserWithCreds, UserWithPassword, User } from './types'
// import { List } from '../node_modules/immutable/dist/immutable'

export default class Utils {
  static stripCreds (fullUser: UserWithCreds): User {
    return {
      email: fullUser.email || '',
      firstName: fullUser.firstName || '',
      lastName: fullUser.lastName || '',
      registrationDate: fullUser.registrationDate,
      birthday: fullUser.birthday || '',
      gender: fullUser.gender || 'Other',
      courses: fullUser.courses || [],
      role: fullUser.role || 'Student',
      avatarUrl: fullUser.avatarUrl || null
    }
  }

  static stripPassword (fullUser: UserWithPassword): User {
    return {
      email: fullUser.email || '',
      firstName: fullUser.firstName || '',
      lastName: fullUser.lastName || '',
      registrationDate: fullUser.registrationDate || '',
      birthday: fullUser.birthday || '',
      gender: fullUser.gender || 'Other',
      courses: fullUser.courses || [],
      role: fullUser.role || 'Student',
      avatarUrl: fullUser.avatarUrl || null
    }
  }
}
