/* @flow */
'use strict'

import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'

import { userType, Gender, Role } from './types'

import UserModel from '../../../models/User'
import Utils from '../../../utils'

import { getHashAndSalt } from '../../../auth/oauth'

export const addUser = {
  type: userType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: GraphQLString },
    password: { type: GraphQLString },
    gender: { type: Gender },
    role: { type: Role }
  },
  resolve: async (source: any, args: any) => {
    let newUser = {
      ...Utils.stripCreds(args),
      registrationDate: (new Date()).toISOString()
    }
    let creds = {
      email: args.email,
      ...getHashAndSalt(args.password)
    }

    return UserModel.insert(newUser, creds)
  }
}

export const deleteUser = {
  type: userType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (source: any, args: any) => {
    let theUser = await UserModel.findOne(args)

    UserModel.delete(args)

    return theUser
  }
}
