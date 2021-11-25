const Hapi = require("@hapi/hapi");

const hapiServer = Hapi.server({
  host: process.env.HOST,
  port: process.env.PORT,
  routes: {
    cors: {
      origin: [process.env.ORIGIN_ALLOWED] // an array of origins or "ignore"
    }
  }
});

const {
  ApolloServer,
  ApolloServerPluginStopHapiServer
} = require("apollo-server-hapi");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginStopHapiServer({ hapiServer })
  ]
});

// change api endpoint as following:
// http://localhost:5050/api/v1/users
hapiServer.realm.modifiers.route.prefix = "/api/v1";

const init = async () => {
  await apolloServer.start();
  await apolloServer.applyMiddleware({
    app: hapiServer,
    cors: true
  });
  await hapiServer.start();
  console.log(`Server running at: ${hapiServer.info.uri}`);
}

module.exports = {
  server: hapiServer,
  init
};
