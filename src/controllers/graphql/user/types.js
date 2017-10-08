/* @flow */
'use strict'

import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
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

export const CourseSubscription = new GraphQLObjectType({
  name: 'CourseSubscription',
  fields: () => ({
    course: { type: new GraphQLNonNull(GraphQLString) },
    progress: { type: new GraphQLNonNull(GraphQLInt) }
  })
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
    courses: { type: new GraphQLList(CourseSubscription) },
    avatarUrl: { type: GraphQLString }
  })
})
