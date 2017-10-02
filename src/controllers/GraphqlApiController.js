/* @flow */
"use strict";

import configureApiController from "./ApiController";
import koaBody from "koa-bodyparser";
import multer from "koa-multer";
import { auth } from "~/middleware/authenticate";
import { graphqlKoa, graphiqlKoa } from "apollo-server-koa";

import schema from "./graphql/schema";
import mongoFileUpl from "~/middleware/mongoFileUpl";
// import { makeExecutableSchema } from 'graphql-tools'

const upload = multer({ storage: multer.memoryStorage() });

export default function configureUserApiController(router: any) {
  configureApiController(router);
  router.post(
    "/graphql",
    auth,
    upload.single("variables.image"),
    mongoFileUpl,
    koaBody(),
    graphqlKoa({ schema })
  );
  router.get("/graphql", auth, graphqlKoa({ schema }));
  router.get("/graphiql", auth, graphiqlKoa({ endpointURL: "/graphql" }));
}
