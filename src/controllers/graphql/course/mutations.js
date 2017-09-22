/* @flow */
'use strict'

import {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString
} from 'graphql'

import CourseModel from '../../../models/Course'

import { courseType } from './types'

export const addStudentToCourse = {
  type: GraphQLBoolean,
  args: {
    courseName: {type: new GraphQLNonNull(GraphQLString)},
    studentEmail: {type: new GraphQLNonNull(GraphQLString)}
  },
  resolve: async (source: any, args: any) => {
    return CourseModel.addStudent(args.courseName, args.studentEmail)
  }
}

export const removeStudentFromCourse = {
  type: GraphQLBoolean,
  args: {
    courseName: {type: new GraphQLNonNull(GraphQLString)},
    studentEmail: {type: new GraphQLNonNull(GraphQLString)}
  },
  resolve: async (source: any, args: any) => {
    return CourseModel.removeStudent(args.courseName, args.studentEmail)
  }
}

export const addCourse = {
  type: courseType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (source: any, args: any) => {
    return (await CourseModel.insert(args)).serialize()
  }
}

export const deleteCourse = {
  type: courseType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (source: any, args: any) => {
    return CourseModel.delete({ ...args.id })
  }
}
