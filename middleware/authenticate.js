const jwt = require('jsonwebtoken');
const authRoutes = require('koa-router')();
const config = require('../config');
const passport = require('../auth/passport');
let { generateTokens } = require("../auth/oauth");

const localAuthHandler = (ctx, next) => {
  return passport.authenticate('local', async (err, user, info) => {
    if (user === false) {
      ctx.status = 401;
      ctx.body = info.message;
    } else {
        const { accessToken, refreshToken } = await generateTokens({user}, process.env['SESSION_SECRET']);
        try {
        ctx.json({
          accessToken,
          refreshToken
        })
      } catch (e) {
        ctx.throw(500, e);
      }
    }
  })(ctx, next);
};

module.exports = function authenticate() {
  //authRoutes.post('/login/callback', loginWithRemoteService); //return the token with information received from remote login provider
  authRoutes.post('/login', localAuthHandler);

  return authRoutes;
}
