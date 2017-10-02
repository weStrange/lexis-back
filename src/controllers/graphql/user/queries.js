/* @flow */
'use strict'

import {
  GraphQLString,
  GraphQLList
} from 'graphql'

import { userType } from './types'

import { User } from '~/models/'

export const user = {
  type: userType,
  args: {
    email: { type: GraphQLString }
  },
  resolve: (source: any, args: { email: string }) => (
    User.findOne({ email: args.email })
  )
}

export const users = {
  type: new GraphQLList(userType),
  args: {
    emails: { type: new GraphQLList(GraphQLString) }
  },
  resolve: (source: any, args: { emails: Array<string> }) => (
    User.find({ email: { $in: args.emails } })
  )
}
