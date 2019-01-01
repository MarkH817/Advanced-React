const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
  },

  async signup(parent, args, ctx, info) {
    // Lowercase the email
    args.email = args.email.toLowerCase()
    // Hash the password
    const password = await bcrypt.hash(args.password, 16)

    const user = await db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    )

    // Create a JWT for them
    const token = jwt.sign({ id: user.id }, process.env.APP_SECRET)

    // Set the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // One year cookie
    })

    // Finally return the user
    return user
  },

  async signin(parent, args, ctx, info) {
    // Lowercase the email
    const email = args.email.toLowerCase()
    // Hash the password

    // 1. Check if there is a user with that email
    const user = await db.query.user({ where: { email } })

    if (!user) {
      throw Error(`No such user found for email ${email}`)
    }

    // 2. Check if the password is correct
    const valid = await bcrypt.compare(args.password, user.password)

    if (!valid) {
      throw Error('Invalid password!')
    }

    // 3. Generate the JWT
    const token = jwt.sign({ id: user.id }, process.env.APP_SECRET)

    // 4. Set the JWT as a cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // One year cookie
    })

    // 5. Return the user
    return user
  },

  async signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token')

    return { message: 'Goodbye!' }
  }
}

module.exports = { Mutation }
