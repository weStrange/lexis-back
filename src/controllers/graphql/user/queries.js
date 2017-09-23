/* @flow */
'use strict'

import {
  GraphQLString
} from 'graphql'

import { userType } from './types'

import UserModel from '../../../models/User'

export const user = {
  type: userType,
  args: {
    email: { type: GraphQLString }
  },
  resolve: async (source: any, args: { email: string }) => {
    let foundUser = (await UserModel.findOne({ email: args.email }))

    return foundUser
  }
}
