/* @flow */
'use strict'

import {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql'

import { Course } from '~/models/'

import {
  courseType,
  Difficulty,
  levelInputType,
  AchievementTypeEnum
} from './types'

import type { CourseInsertPayload } from '~/types'

export const addStudentToCourse = {
  type: GraphQLBoolean,
  args: {
    courseId: { type: new GraphQLNonNull(GraphQLString) },
    studentEmail: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (
    source: any,
    args: { courseId: string, studentEmail: string }
  ) => {
    let course = await Course.findById(args.courseId)
    return course.addStudent(args.studentEmail)
  }
}

export const removeStudentFromCourse = {
  type: GraphQLBoolean,
  args: {
    courseId: { type: new GraphQLNonNull(GraphQLString) },
    studentEmail: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (
    source: any,
    args: { courseId: string, studentEmail: string }
  ) => {
    let course = await Course.findById(args.courseId)
    return course.removeStudent(args.studentEmail)
  }
}

export const addCourse = {
  type: courseType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    difficulty: { type: new GraphQLNonNull(Difficulty) },
    levels: { type: new GraphQLList(levelInputType) },
    achievements: { type: new GraphQLList(AchievementTypeEnum) },
    students: { type: new GraphQLList(GraphQLString) },
    imageUrl: { type: GraphQLString }
  },
  resolve: async (source: any, args: CourseInsertPayload) => {
    return await Course.create({
      ...args,
      // TODO: this should be handled by authorization
      creatorEmail: 'test@test.com'
    })
  }
}

export const updateCourse = {
  type: courseType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    difficulty: { type: Difficulty },
    levels: { type: new GraphQLList(levelInputType) },
    achievements: { type: new GraphQLList(AchievementTypeEnum) },
    students: { type: new GraphQLList(GraphQLString) },
    imageUrl: { type: GraphQLString }
  },
  resolve: async (source: any, args: any) => {
    return Course.findOneAndUpdate({ _id: args.id }, args)
  }
}

export const deleteCourse = {
  type: courseType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (source: any, args: { id: string }) => {
    return Course.findOneAndRemove({ _id: args.id })
  }
}
