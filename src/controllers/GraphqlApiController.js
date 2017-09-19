/* @flow */
'use strict'

import configureApiController from './ApiController'
import koaBody from 'koa-bodyparser'

import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'

import schema from './graphql/schema'
// import { makeExecutableSchema } from 'graphql-tools'

export default function configureUserApiController (router: any) {
  configureApiController(router)
  // console.log(schema._mutationType)
  router.post('/graphql', koaBody(), graphqlKoa({ schema }))
  router.get('/graphql', graphqlKoa({ schema }))
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))
}
