/* @flow */
'use strict'

import * as Graphql from 'graphql'

import UserModel from '../../models/User'
import Utils from '../../utils'

import { generateTokens, getHashAndSalt } from '../../auth/oauth'

const userType = new Graphql.GraphQLObjectType({
  name: 'User',
  fields: () => ({
    email: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (user) => user.email
    },
    firstName: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (user) => user.firstName
    },
    lastName: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (user) => user.lastName
    },
    registrationDate: {
      type: Graphql.GraphQLString,
      resolve: (user) => user.registrationDate
    },
    birthday: {
      type: Graphql.GraphQLString,
      resolve: (user) => user.birthday
    }
  })
})

const queryType = new Graphql.GraphQLObjectType({
  name: 'Query',
  description: 'query users',
  fields: {
    user: {
      type: new Graphql.GraphQLList(userType),
      args: {
        email: {type: Graphql.GraphQLString}
      },
      resolve: async (source, args) => {
        let foundUser = await UserModel.findOne({ email: args.email })
        // $FlowIgnore
        return foundUser ? new User(foundUser) : null
      }
    }
  }
})

const mutationType = new Graphql.GraphQLObjectType({
  name: 'Mutation',
  description: 'Mutation of the users',
  fields: {
    addUser: {
      type: userType,
      args: {
        email: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)},
        firstName: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)},
        lastName: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)},
        birthday: {type: Graphql.GraphQLString},
        password: {type: Graphql.GraphQLString}
      },
      resolve: async (source, args) => {
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
    },
    deleteUser: {
      type: userType,
      args: {
        email: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)}
      },
      resolve: async (source, args) => {
        return UserModel.delete(args)
      }
    }
  }
})

export default new Graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType
})
