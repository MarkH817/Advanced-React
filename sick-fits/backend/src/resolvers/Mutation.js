const { db } = require('../db')

const Mutation = {
  // TODO: Check for authentication
  async createItem(parent, args, ctx, info) {
    const item = await db.mutation.createItem(
      {
        data: { ...args }
      },
      info
    )

    return item
  },

  async updateItem(parent, args, ctx, info) {
    const updates = { ...args }

    // Remove id since that always stays the same
    delete updates.id

    return db.mutation.updateItem(
      {
        data: updates,
        where: { id: args.id }
      },
      info
    )
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id }

    // 1. Find the item
    const item = await db.query.item({ where }, `{ id title }`)

    // 2. Check for permissions or item ownership
    // TODO

    // 3. Delete it
    return db.mutation.deleteItem({ where }, info)
  }
}

module.exports = { Mutation }
