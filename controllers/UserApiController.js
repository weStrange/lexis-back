const ApiController = require('./ApiController');
const koaBody = require('koa-bodyparser');
const bodyParser = require('body-parser');

var { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');
var { makeExecutableSchema } = require('graphql-tools');

var typeDefs = [`
type Query {
  hello: String
}

schema {
  query: Query
}`];

var resolvers = {
  Query: {
    hello(root) {
      return 'world';
    }
  }
};

const schema = makeExecutableSchema({typeDefs, resolvers});

const customGraphqlMiddleware = function (
  ctx,
  next
) {
  ctx.graphql()
  return next()
}

class UserApiController extends ApiController {
  constructor(router){
    super(router);
    // console.log(graphqlKoa({ schema }))
    router.post('/graphql', koaBody(), customGraphqlMiddleware, graphqlKoa({ schema }));
    router.get('/graphql', graphqlKoa({ schema }));
    router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));
  }
}

module.exports = UserApiController;
