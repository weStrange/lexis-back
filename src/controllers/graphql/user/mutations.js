/* @flow */
'use strict'

// import { List } from 'immutable'

import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'

import { userType, Gender, Role } from './types'

import { User } from '~/models/'
import Utils from '~/utils'


import type { Gender as GenderType, Role as RoleType } from '~/types'

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
  resolve: async (source: any, args: AddUserArgs) => {
    let newUser = {
      ...Utils.stripPassword({
        ...args,
        registrationDate: new Date().toISOString(),
        courses: []
      }),
      avatarUrl: args.avatarUrl || null,
      ...getHashAndSalt(args.password)
    }

    return User.create(newUser)
  }
}

export const updateUser = {
  type: userType,
  args: {
    email: { type: GraphQLString }, // as identifier
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    birthday: { type: GraphQLString },
    gender: { type: Gender },
    avatarUrl: { type: GraphQLString },
    role: { type: Role }
  },
  resolve: async (source: any, args: any) =>
    User.findOneAndUpdate({ email: args.email }, args)
}

export const makeProgress = {
  type: userType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    courseId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (source: any, args: any) => {
    let foundUser = await User.findOne({ email: args.email })
    console.log(foundUser.courses.filter(s => s.course === args.courseId).length)
    foundUser.courses = foundUser.courses.map((p) => p.course === args.courseId
    ? {
      ...p,
      course: p.course,
      progress: p.progress + 1
    }
    : p)
    console.log(foundUser.courses)
    foundUser.save()
    console.log(foundUser.courses)
    return foundUser
  }
}

export const deleteUser = {
  type: userType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (source: any, args: { email: string }) => {
    return User.findOneAndRemove(args)
  }
}
