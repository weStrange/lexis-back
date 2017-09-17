/* @flow */
'use strict'

const configureApiController = require('./ApiController')
// const koaBody = require('koa-bodyparser')
// const User = require('../models/User')

function configureUserApiController (router: any) {
  configureApiController(router)
}

module.exports = configureUserApiController
