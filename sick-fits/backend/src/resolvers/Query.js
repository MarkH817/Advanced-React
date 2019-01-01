const { forwardTo } = require('prisma-binding')

const { db } = require('../db')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  async me(parent, args, ctx, info) {
    // Check for user Id
    if (!ctx.request.userId) {
      return null
    }

    return db.query.user({ where: { id: ctx.request.userId } }, info)
  }
  //   async items(parent, args, ctx, info) {
  //     const items = await db.query.items();
  //     return items;
  //   }
}

module.exports = { Query }
