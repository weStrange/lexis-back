/* global User */
/* @flow */
'use strict'

import configureApiController from './ApiController'
import koaBody from 'koa-bodyparser'

import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import { makeExecutableSchema } from 'graphql-tools'

const UserModel = require('../models/User')

var typeDefs = [`
enum Gender {
  MALE
  FEMALE
  OTHER
}

type User {
  email: String!,
  firstName: String,
  lastName: String,
  registrationDate: String,
  birthday: String,
  gender: Gender
}

type Query {
  user(email: String!): User
}

schema {
  query: Query
}`]

var resolvers = {
  Query: {
    async user (root, args, ctx) {
      let foundUser = await UserModel.findOne({ email: args.email })
      // $FlowIgnore
      return foundUser ? new User(foundUser) : null
    }
  }
}

const schema = makeExecutableSchema({typeDefs, resolvers})

const customGraphqlMiddleware = function (
  ctx: any,
  next: () => void
) {
  ctx.graphql()
  return next()
}

export default function configureUserApiController (router: any) {
  configureApiController(router)

  router.post('/graphql', koaBody(), customGraphqlMiddleware, graphqlKoa({ schema }))
  router.get('/graphql', graphqlKoa({ schema }))
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))
}
