/* @flow */
'use strict'

import {
  GraphQLString
} from 'graphql'

import CourseModel from '../../../models/Course'

import { courseType } from './types'

export const course = {
  type: courseType,
  args: {
    name: { type: GraphQLString }
  },
  resolve: async (source: any, args: any) => {
    let foundCourse = (await CourseModel.findOne({ name: args.name }))

    if (foundCourse) {
      return (await foundCourse).serialize()
    }

    return null
  }
}
