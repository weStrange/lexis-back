/* @flow */
'use strict'

import configureApiController from './ApiController'
import koaBody from 'koa-bodyparser'
import multer from 'koa-multer'

import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'

import schema from './graphql/schema'
import mongoFileUpl from '~/middleware/mongoFileUpl'
// import { makeExecutableSchema } from 'graphql-tools'

const upload = multer({ storage: multer.memoryStorage() })

export default function configureUserApiController (router: any) {
  configureApiController(router)
  router.post('/graphql',
    upload.single('variables.image'),
    mongoFileUpl,
    koaBody(),
    graphqlKoa({ schema }))
  router.get('/graphql', graphqlKoa({ schema }))
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))
}
