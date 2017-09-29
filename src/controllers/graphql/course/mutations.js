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
    courseName: {type: new GraphQLNonNull(GraphQLString)},
    studentEmail: {type: new GraphQLNonNull(GraphQLString)}
  },
  resolve: async (
    source: any,
    args: { courseName: string, studentEmail: string }
  ) => {
    
    let course = await Course.findOne({name: args.courseName})
    return await course.addStudent({email: args.studentEmail})
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
    let course = await Course.findOne({name: args.courseName})
    return await course.removeStudent({email: args.studentEmail})
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
    students: { type: new GraphQLList(GraphQLString) }
  },
  resolve: async (source: any, args: CourseInsertPayload) => {
    return (await Course.create(args)).toJSON()
  }
}

export const updateCourse = {
  type: GraphQLInt,
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    difficulty: { type: Difficulty },
    levels: { type: new GraphQLList(levelInputType) },
    achievements: { type: new GraphQLList(AchievementTypeEnum) },
    students: { type: new GraphQLList(GraphQLString) }
  },
  resolve: async (source: any, args: any) => {
    return Course.update({ id: args.id }, args)
  }
}

export const deleteCourse = {
  type: courseType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (source: any, args: { id: string }) => {
    let course = await Course.findOne({ id: args.id })
    return await course.remove()
  }
}
