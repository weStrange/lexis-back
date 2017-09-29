/* @flow */
'use strict'

import {
  GraphQLString
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
