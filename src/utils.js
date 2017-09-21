/* eslint { "global-require": 0 } */
/* @flow */
'use strict'

import type {
  UserWithCreds,
  User
} from './types'
import { List } from '../node_modules/immutable/dist/immutable'

export default class Utils {
  static stripCreds (
    fullUser: UserWithCreds
  ): User {
    return {
      email: fullUser.email || '',
      firstName: fullUser.firstName || '',
      lastName: fullUser.lastName || '',
      registrationDate: fullUser.registrationDate || '',
      birthday: fullUser.birthday || '',
      gender: fullUser.gender || '',
      courses: fullUser.courses || List(),
      role: fullUser.role || 'Student',
      avatarUrl: fullUser.avatarUrl || null
    }
  }
}
