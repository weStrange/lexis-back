/* @flow */
'use strict'

import configureApiController from './ApiController'
// const koaBody = require('koa-bodyparser')
// const User = require('../models/User')

export default function configureUserApiController (router: any) {
  configureApiController(router)
}
