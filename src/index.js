/* @flow */
'use strict'

import destroyable from 'server-destroy'
import Koa from 'koa'
import bodyParser from 'koa-body'
import jwt from 'koa-jwt'
import logger from 'winston'
import dotenv from 'dotenv'

import passport from './auth/passport'
import configureAuth from './middleware/authenticate'
import responder from './middleware/responder'
import config from './config'
import configureRouting from './middleware/routing'

if (module.hot) {
  // $FlowIgnore
  module.hot.accept('./auth/passport', () => {})
}

dotenv.config()

// const koaWebpack = require('koa-webpack');
// const webpackConfig = require('./webpack.config');

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, { level: 'debug', colorize: true })

let authenticate = configureAuth()

// const netLogger = require('./middleware/logger');

let routing = configureRouting()

const app = new Koa()
// app.proxy = true; // this is needed if running from behind a reverse proxy

// log response before sending out
// app.use(netLogger.response());
/*
//more info https://github.com/shellscape/koa-webpack
if(config.env !== 'production'){
  app.use(koaWebpack(webpackConfig));
}
*/
// serve static files - disable when running in production and/or from under a proxy
// app.use(serve(path.join(config.appRoot, 'client', 'dist')));

// top level handler (for errors and response rendering) also adds the helper
// method ctx.json() and ctx.view() and ctx.log as well as renders the final response
// app.use(cors())
// app.use(responder({appRoot: config.appRoot, app: app}))
// note: by default multipart requests are not parsed. More info: https://github.com/dlau/koa-body
app.use(bodyParser())
// app.use(netLogger.request());
// app.use(new CSRF(config.csrf));
// your authentication middleware
app.use(passport.initialize())

app.use(authenticate.routes())
app.use(authenticate.allowedMethods())

// app.use(passport.session())
//
// app.use(
//   jwt({secret: process.env['SESSION_SECRET'], debug: true})
//     // .unless({path: [/^((?!\/api[\/$\s]).)+$/g]})
// )

// routing - will call your controllers, etc.
app.use(routing.routes())
app.use(routing.allowedMethods())

// jwt token verification for any route containing /api/ segment (unless they are GET routes)

// if you want to have some middleware running AFTER some controllers (controller will have to call await next)
// remember that after controllers the logic will flow UP the stack so every middleware's code that comes
// after the await next() will run too
let server = app.listen(7000)
destroyable(server)

process.on('uncaughtException', () => {
  server.destroy()
})

process.on('SIGTERM', () => {
  server.destroy()
})

process.on('SIGINT', () => {
  server.destroy()
})

// process.on('SIGKILL', () => {
//   server.destroy()
// })

logger.info('Application running on port 7000')
