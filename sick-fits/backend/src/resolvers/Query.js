const { forwardTo } = require('prisma-binding')

const { db } = require('../db')
const { hasPermission } = require('../utils')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  async me(parent, args, ctx, info) {
    // Check for userId
    if (!ctx.request.userId) {
      return null
    }

    return db.query.user({ where: { id: ctx.request.userId } }, info)
  },
  async users(parent, args, ctx, info) {
    // 1. Check if they're logged in
    if (!ctx.request.userId) {
      throw Error('You are not logged in!')
    }

    // 2. Check if the user has permissions to query for all users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])

    // 3. Return the users query
    return db.query.users({}, info)
  }
}

module.exports = { Query }
