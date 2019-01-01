const { forwardTo } = require('prisma-binding')

const { db } = require('../db')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db')
  //   async items(parent, args, ctx, info) {
  //     const items = await db.query.items();
  //     return items;
  //   }
}

module.exports = { Query }
