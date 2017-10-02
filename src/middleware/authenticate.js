/* @flow */
"use strict";

import getRouter from "koa-router";

import passport from "~/auth/passport";
// import { generateTokens, getHashAndSalt } from "~/auth/oauth";

import { User } from "~/models/";
import Utils from "~/utils";

import type { /* InputCreds, */ User as UserType, Credentials } from "~/types";

let authRoutes = getRouter();

const localAuthHandler = async (ctx, next) => {
  ctx.body = await ctx.state.user.generateJwt();
  await next();
};

const registrationHandler = async (ctx, next) => {
  let payload = ctx.request.body;
  const { password, ...userInfo } = payload;
  let newUser = new User(userInfo);
  newUser.setPassword(payload.password);

  if (!await User.findOne({ email: userInfo.email })) {
    let result = await User.create(newUser);
    // the toJSON exclude credentials! Check the schema to see what will be passed here
    ctx.body = result.toJSON();
  }

  await next();
};

export default function authenticate() {
  // authRoutes.post('/login/callback', loginWithRemoteService); //return the token with information received from remote login provider
  authRoutes.post(
    "/login",
    passport.authenticate("local", { session: false }),
    localAuthHandler
  );
  authRoutes.post("/register", registrationHandler);

  return authRoutes;
}
