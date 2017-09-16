/* flow */
'use strict'

const configureController = require('./Controller')

function configureApiController (router) {
  configureController(router)
}

module.exports = configureApiController
