/* @flow */
'use strict'

import controllers from '~/controllers'
import koaRouter from 'koa-router'
import logger from 'winston'

const router = koaRouter()

export default function route () {
  // Remember - if you don't call await next(); then this middleware

  // logger.debug(`loading ${Object.keys(controllers).length} controllers...`)
  for (let controllerName in controllers) {
    if (controllers[controllerName]) {
      logger.debug(`loading ${controllerName}`)
      // eslint-ignore
      controllers[controllerName](router)
      logger.debug(`${controllerName} loaded successfully`)
    }
  }
  logger.debug('finished loading controllers...')

  return router
}
