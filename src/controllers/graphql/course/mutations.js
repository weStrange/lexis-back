/* @flow */
'use strict'

import {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql'

import CourseModel from '../../../models/Course'

import {
  courseType,
  Difficulty,
  levelInputType,
  AchievementTypeEnum
} from './types'

import type { CourseInsertPayload } from '../../../types'

export const addStudentToCourse = {
  type: GraphQLBoolean,
  args: {
    courseName: {type: new GraphQLNonNull(GraphQLString)},
    studentEmail: {type: new GraphQLNonNull(GraphQLString)}
  },
  resolve: async (
    source: any,
    args: { courseName: string, studentEmail: string }
  ) => {
    return CourseModel.addStudent(args.courseName, args.studentEmail)
  }
}

export const removeStudentFromCourse = {
  type: GraphQLBoolean,
  args: {
    courseName: {type: new GraphQLNonNull(GraphQLString)},
    studentEmail: {type: new GraphQLNonNull(GraphQLString)}
  },
  resolve: async (
    source: any,
    args: { courseName: string, studentEmail: string }
  ) => {
    return CourseModel.removeStudent(args.courseName, args.studentEmail)
  }
}

export const addCourse = {
  type: courseType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    difficulty: { type: new GraphQLNonNull(Difficulty) },
    levels: { type: new GraphQLList(levelInputType) },
    achievements: { type: new GraphQLList(AchievementTypeEnum) },
    students: { type: new GraphQLList(GraphQLString) }
  },
  resolve: async (source: any, args: CourseInsertPayload) => {
    return (await CourseModel.insert(args)).serialize()
  }
}

export const updateCourse = {
  type: GraphQLInt,
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    difficulty: { type: Difficulty },
    levels: { type: new GraphQLList(levelInputType) },
    achievements: { type: new GraphQLList(AchievementTypeEnum) },
    students: { type: new GraphQLList(GraphQLString) }
  },
  resolve: async (source: any, args: any) => {
    return CourseModel.update({ id: args.id }, args)
  }
}

export const deleteCourse = {
  type: courseType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (source: any, args: { id: string }) => {
    return CourseModel.delete({ id: args.id })
  }
}
