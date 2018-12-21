const { db } = require("../db");

const Mutation = {
  // TODO: Check for authentication
  async createItem(parent, args, ctx, info) {
    const item = await db.mutation.createItem(
      {
        data: { ...args }
      },
      info
    );

    return item;
  }
};

module.exports = { Mutation };
