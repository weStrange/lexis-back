/* @flow */
'use strict'

import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'

import { User } from '~/models/'

import { userType } from '../user/types'

export const uploadPicture = {
  type: userType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    avatarUrl: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (source: any, args: any) => {
    let { email, avatarUrl } = args

    // let theUser = await User.findOne({ email })

    // let userMutation = { ...theUser, avatarUrl }

    const updateResult = await User.update({ email }, args)
    const userMutation = await User.findOne({ email })

    if (updateResult) return userMutation
  }
}
