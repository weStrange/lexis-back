/* @flow */
'use strict'

import {
  GraphQLString,
  GraphQLList
} from 'graphql'

import CourseModel from '../../../models/Course'

import { courseType, Difficulty } from './types'

import type { CourseQueryPayload } from '../../../types'

export const course = {
  type: new GraphQLList(courseType),
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    creatorEmail: { type: GraphQLString },
    difficulty: { type: Difficulty }
  },
  resolve: async (source: any, args: CourseQueryPayload) => {
    let foundCourses = (await CourseModel.find(args))

    return (await foundCourses).map((p) => p.serialize())
  }
}
