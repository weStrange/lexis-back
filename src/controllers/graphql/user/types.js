/* @flow */
'use strict'

import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} from 'graphql'

import { AchievementTypeEnum } from '../course/types'

export const Gender = new GraphQLEnumType({
  name: 'Gender',
  values: {
    MALE: { value: 'Male' },
    FEMALE: { value: 'Female' },
    OTHER: { value: 'Other' }
  }
})

export const Role = new GraphQLEnumType({
  name: 'Role',
  values: {
    STUDENT: { value: 'Student' },
    TEACHER: { value: 'Teacher' }
  }
})

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.email
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.firstName
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.lastName
    },
    registrationDate: {
      type: GraphQLString,
      resolve: (user) => user.registrationDate
    },
    birthday: {
      type: GraphQLString,
      resolve: (user) => user.birthday
    },
    gender: {
      type: Gender,
      resolve: (user) => user.gender
    },
    achievements: {
      type: AchievementTypeEnum,
      resolve: (user) => user.achievements
    },
    role: {
      type: Role,
      resolve: (user) => user.role
    },
    courses: {
      type: new GraphQLList(GraphQLString),
      resolve: (user) => user.courses
    },
    avatarUrl: {
      type: GraphQLString,
      resolve: (user) => user.avatarUrl
    }
  })
})
