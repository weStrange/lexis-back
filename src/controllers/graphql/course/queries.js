/* @flow */
'use strict'

import { GraphQLString, GraphQLList } from 'graphql'

import { Course, User } from '~/models/'

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
    let query = {}
    for (let key in args) {
      if (args[key] !== undefined && key !== 'id') {
        query[key] = args[key]
      }
    }

    if (args.id) {
      query = {
        ...query,
        _id: args.id
      }
    }
    console.log(query, args)
    return Course.find(query)
  }
}

export const coursesByIds = {
  type: new GraphQLList(courseType),
  args: {
    ids: { type: new GraphQLList(GraphQLString) }
  },
  resolve: (source: any, args: { ids: Array<string> }) =>
    Course.find({ _id: { $in: args.ids } })
}

export const coursesByStudentEmail = {
  type: new GraphQLList(courseType),
  args: {
    email: { type: GraphQLString }
  },
  resolve: async (source: any, args: { email: string }) => {
    const user = await User.findOne(args)

    return Course.find({ _id: { $in: user.courses } })
  }
}
