/* @flow */
'use strict'

// import { List } from 'immutable'

import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} from 'graphql'

import { userType, Gender, Role } from './types'

import UserModel from '../../../models/User'
import Utils from '../../../utils'

import { getHashAndSalt } from '../../../auth/oauth'

import type { Gender as GenderType, Role as RoleType } from '../../../types'

type AddUserArgs = {
  email: string,
  firstName: string,
  lastName: string,
  birthday: string,
  password: string,
  gender: GenderType,
  role: RoleType,
  avatarUrl: string
}
export const addUser = {
  type: userType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: GraphQLString },
    password: { type: new GraphQLNonNull(GraphQLString) },
    gender: { type: Gender },
    role: { type: Role },
    avatarUrl: { type: GraphQLString }
  },
  resolve: async (
    source: any,
    args: AddUserArgs
  ) => {
    let newUser = Utils.stripPassword({
      ...args,
      registrationDate: (new Date()).toISOString(),
      courses: [],
      avatarUrl: args.avatarUrl || null
    })
    let creds = {
      email: args.email,
      ...getHashAndSalt(args.password)
    }

    return UserModel.insert(newUser, creds)
  }
}

export const updateUser = {
  type: GraphQLInt,
  args: {
    email: { type: GraphQLString }, // as identifier
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    birthday: { type: GraphQLString },
    gender: { type: Gender },
    role: { type: Role }
  },
  resolve: async (source: any, args: any) => {
    return UserModel.update({ email: args.email }, args)
  }
}

export const deleteUser = {
  type: userType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (source: any, args: { email: string }) => {
    let theUser = await UserModel.findOne(args)

    UserModel.delete(args)

    return theUser
  }
}
