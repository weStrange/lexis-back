/* @flow */
'use strict'

import { GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } from 'graphql'

import { userType } from './types'

import { User } from '~/models/'

export const user = {
  type: userType,
  args: {
    email: { type: GraphQLString }
  },
  resolve: (source: any, args: { email: string }) =>
    User.findOne({ email: args.email })
}

export const users = {
  type: new GraphQLList(userType),
  args: {
    emails: { type: new GraphQLList(GraphQLString) }
  },
  resolve: (source: any, args: { emails: Array<string> }) =>
    User.find({ email: { $in: args.emails } })
}

export const progress = {
  type: GraphQLInt,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    courseId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (source: any, args: { email: string, courseId: string }) => {
    try {
      const foundUser = await User
        .findOne({ email: args.email })

      if (!foundUser) {
        return 0
      }

      const subscription = foundUser.courses
        .filter((p) => p.course === args.courseId)[0]

      return subscription.progress
    }
    catch (err) {
      if (err) {
        return null
      }
    }
  }
}
