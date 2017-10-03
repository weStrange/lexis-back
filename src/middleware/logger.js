/* @flow */
'use strict'

const logger = require('winston')
/**
 * Place this at the top of the stack
 */
type LogResponseOptions = {}
module.exports.response = function logResponse (options: LogResponseOptions) {
  return async function (ctx: any, next: () => void) {
    await next()
    logger.verbose(`Response: \n ${ctx.body}`)
  }
}

/**
 * Place this AFTER bodyparser
 */
type LogRequestOptions = {}
module.exports.request = function logRequest (options: LogRequestOptions) {
  return async function (ctx: any, next: () => void) {
    logger.verbose(`New Request from ${ctx.ip}. Body:`)
    logger.verbose(ctx.body)
    await next()
  }
}
