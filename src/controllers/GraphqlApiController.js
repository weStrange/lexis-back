/* global User */
/* @flow */
'use strict'

const configureApiController = require('./ApiController')
const koaBody = require('koa-bodyparser')

var { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')
var { makeExecutableSchema } = require('graphql-tools')

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

input RegisterInput {
  email: String!,
  firstName: String!,
  lastName: String!,
  birthday: String,
  gender: Gender
}

type Mutation {
  register(input: RegisterInput!): User
}

schema {
  query: Query,
  mutation: Mutation
}`]

var resolvers = {
  Query: {
    async user (root, args, ctx) {
      let foundUser = (await UserModel.find({ email: args.email }))[0]
      return new User(foundUser)
    }
  },
  Mutation: {
    async register (root, args, ctx) {
      return (await UserModel.insert([{ ...args.input }]))[0]
    }
  }
}

const schema = makeExecutableSchema({typeDefs, resolvers})

const customGraphqlMiddleware = function (
  ctx,
  next
) {
  ctx.graphql()
  return next()
}

function configureUserApiController (router: any) {
  configureApiController(router)

  router.post('/graphql', koaBody(), customGraphqlMiddleware, graphqlKoa({ schema }))
  router.get('/graphql', graphqlKoa({ schema }))
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))
}

module.exports = configureUserApiController
