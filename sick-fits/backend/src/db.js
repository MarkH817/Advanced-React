const { Prisma } = require("prisma-binding");
const { resolve } = require("path");

/**
 * Connects to the remote Prisma DB and
 * gives us a way to interface it using JavaScript
 */
const db = new Prisma({
  typeDefs: resolve(__dirname, "./generated/prisma.graphql"),
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false
});

module.exports = { db };
