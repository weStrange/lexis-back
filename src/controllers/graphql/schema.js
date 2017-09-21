/* @flow */
'use strict'

import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql'

import * as userMutations from './user/mutations'
import * as userQueries from './user/queries'
import * as courseMutations from './course/mutations'
import * as courseQueries from './course/queries'
import * as avatarMutations from './avatar/mutations'

const queryType = new GraphQLObjectType({
  name: 'Query',
  description: 'All queries',
  fields: {
    ...userQueries,
    ...courseQueries
  }
})

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'All mutations',
  fields: {
    ...userMutations,
    ...courseMutations,
    ...avatarMutations
  }
})

export default new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})
