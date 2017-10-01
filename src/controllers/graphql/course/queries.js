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
    let query = {}
    for (let key in args) {
      if (args[key] !== undefined && key !== 'id')  {
        query = {
          ...query,
          key: args[key]
        }
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
