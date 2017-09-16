/* flow */
'use strict'

const configureApiController = require('./ApiController')
const koaBody = require('koa-bodyparser')

var { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')
var { makeExecutableSchema } = require('graphql-tools')

var typeDefs = [`
type Query {
  hello: String
}

schema {
  query: Query
}`]

var resolvers = {
  Query: {
    hello (root) {
      return 'world'
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

function configureUserApiController (router) {
  configureApiController(router)

  router.post('/graphql', koaBody(), customGraphqlMiddleware, graphqlKoa({ schema }))
  router.get('/graphql', graphqlKoa({ schema }))
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))
}

module.exports = configureUserApiController
