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
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    registrationDate: { type: GraphQLString },
    birthday: { type: GraphQLString },
    gender: { type: Gender },
    achievements: { type: AchievementTypeEnum },
    role: { type: Role },
    courses: { type: new GraphQLList(GraphQLString) },
    avatarUrl: { type: GraphQLString }
  })
})
