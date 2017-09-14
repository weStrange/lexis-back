const jwt = require('jsonwebtoken');
const authRoutes = require('koa-router')();
const config = require('../config');
const passport = require('koa-passport');

app.use(passport.initialize())
app.use(passport.session())

// TODO: add passport configs
// Example of passport and jwt together: https://github.com/f0rr0/koa-passport-jwt

async function login(ctx, next){
  //compare password
  if (ctx.request.body.password === 'password') {
    ctx.status = 200;

    switch(ctx.header.strategy){
      case 'google':
        return ctx.redirect('/'); // new require('googleapis').auth.OAuth2(clientid, secret, 'mysite/login/callback').generateAuthUrl or something like that
      case 'facebook':
        return ctx.redirect('/'); // get the facebook auth redirect url
      case 'github':
        return ctx.redirect('/'); // redirect to github auth url
      case 'metropolia':
       //if you are using passport, you need to utilize the available SAML strategy to login with Finnish (and most EU) universities accounts.
       //general steps are the same though, its just that the callback and whatnot passport does for you, but you still need to get the service url
       //somewhere and register your service as trusted with the university's IT department
       return ctx.redirect('/'); // redirect to Metropolia SAML provider url (need to register app as trusted with IT services first)
    }


    let token = { username: 'XxX_4ssD3str0y3r_XxX', role: 'Noscoper' }; //await User.matchUser(ctx.body.username, ctx.body.password);

    ctx.json({
      token: jwt.sign(token, config.keys.session), //Should be the same secret key as the one used is jwt configuration
      message: "Successfully logged in!"
    });
    //done
  } else {
    ctx.status = ctx.status = 401;
    ctx.json({
      message: "Authentication failed"
    });
  }

  //another option is to ctx.redirect to some page imediately, which would
  //eliminate the need to responde to the token. But you will need to set
  //the cookie header correctly: ctx.cookies.set('auth_token', token, {signed: true, maxAge: 1000*60*60*6, secure: true}))
  //and make sure that the jwt middleware checks the cookie too if the Authorization header is missing.
  //Alternatively if you are using React or Angular you can attach a sort of 'middleware' that will
  //automatically append the header for every request anyway.
  return ctx;
}

module.exports = function authenticate(){

  //authRoutes.post('/login/callback', loginWithRemoteService); //return the token with information received from remote login provider
  authRoutes.post('/login', login);

  return authRoutes;
}
