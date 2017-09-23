/* @flow */
'use strict'

import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'

import UserModel from '../../../models/User'

import { userType } from '../user/types'

export const uploadPicture = {
  type: userType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    avatarUrl: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (source: any, args: any) => {
    let { email, avatarUrl } = args

    // let theUser = await UserModel.findOne({ email })

    // let userMutation = { ...theUser, avatarUrl }

    const updateResult = await UserModel.update({ email }, args)
    const userMutation = await UserModel.findOne({ email })

    if (updateResult) return userMutation
  }
}
