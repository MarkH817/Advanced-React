const { GraphQLServer } = require("graphql-yoga");
const { resolve } = require("path");

const { Mutation } = require("./resolvers/Mutation");
const { Query } = require("./resolvers/Query");
const { db } = require("./db");

function createServer() {
  return new GraphQLServer({
    typeDefs: resolve(__dirname, "./schema.graphql"),

    resolvers: {
      Mutation,
      Query
    },

    resolverValidationOptions: {
      requireResolversForResolveType: false
    },

    // Used for forwardTo('db') function from 'prisma-binding'
    context: req => ({ ...req, db })
  });
}

module.exports = { createServer };
