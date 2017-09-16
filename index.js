const Koa = require('koa');
const CSRF = require('koa-csrf');
const bodyParser = require('koa-body');
const jwt = require('koa-jwt');
const serve = require('koa-static');
const path = require('path');
const passport = require('./auth/passport');

require('dotenv').config()

// const koaWebpack = require('koa-webpack');
// const webpackConfig = require('./webpack.config');

const logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { level: 'debug', colorize: true });

const authenticate = require('./middleware/authenticate')();
const responder = require('./middleware/responder');
//const netLogger = require('./middleware/logger');
const config = require('./config');
const routing = require('./middleware/routing')();

const app = new Koa()
// app.proxy = true; // this is needed if running from behind a reverse proxy

//log response before sending out
//app.use(netLogger.response());
/*
//more info https://github.com/shellscape/koa-webpack
if(config.env !== 'production'){
  app.use(koaWebpack(webpackConfig));
}
*/
//serve static files - disable when running in production and/or from under a proxy
//app.use(serve(path.join(config.appRoot, 'client', 'dist')));

// top level handler (for errors and response rendering) also adds the helper
// method ctx.json() and ctx.view() and ctx.log as well as renders the final response
app.use(responder({appRoot: config.appRoot, app: app}));
//note: by default multipart requests are not parsed. More info: https://github.com/dlau/koa-body
app.use(bodyParser());
//app.use(netLogger.request());
//app.use(new CSRF(config.csrf));
//your authentication middleware
app.use(passport.initialize())

app.use(authenticate.routes());
app.use(authenticate.allowedMethods());

// app.use(passport.session())
// TODO: uncomment and configure properly
/*
app.use(
  jwt({secret: process.env['SESSION_SECRET']})
    // .unless({path: [/^((?!\/api[\/$\s]).)+$/g]})
);
*/
//routing - will call your controllers, etc.
app.use(routing.routes());
app.use(routing.allowedMethods());


//jwt token verification for any route containing /api/ segment (unless they are GET routes)

//if you want to have some middleware running AFTER some controllers (controller will have to call await next)
//remember that after controllers the logic will flow UP the stack so every middleware's code that comes
//after the await next() will run too
app.listen(3000);

logger.info('Application running on port 3000');
