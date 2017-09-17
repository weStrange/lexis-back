/* @flow */
'use strict'

const configureController = require('./Controller')

function configureApiController (router: any) {
  configureController(router)
}

module.exports = configureApiController
