/* @flow */
'use strict'

import {
  GraphQLString,
  GraphQLList
} from 'graphql'

import { Course } from '~/models/'

import { courseType, Difficulty } from './types'

import type { CourseQueryPayload } from '~/types'

export const course = {
  type: new GraphQLList(courseType),
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    creatorEmail: { type: GraphQLString },
    difficulty: { type: Difficulty }
  },
  resolve: async (source: any, args: CourseQueryPayload) => {
    let foundCourses = (await Course.find(args))

    return (await foundCourses).map((p) => p.toJSON())
  }
}
