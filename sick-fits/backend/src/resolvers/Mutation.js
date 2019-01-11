const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')

const { db } = require('../db')
const { transport, makeANiceEmail } = require('../mail')
const { hasPermission } = require('../utils')

const asyncRandomBytes = promisify(randomBytes)

const Mutation = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw Error('You must be logged in to do that!')
    }

    const item = await db.mutation.createItem(
      {
        data: {
          // Connects the User to the created Item
          user: { connect: { id: ctx.request.userId } },
          ...args
        }
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
    const item = await db.query.item({ where }, `{ id title user { id } }`)

    // 2. Check for item ownership or permissions
    const ownsItem = item.user.id === ctx.request.userId
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ['ADMIN', 'ITEMDELETE'].includes(permission)
    )

    if (!ownsItem && !hasPermissions) {
      throw Error(`You don't have permission to do that!`)
    }

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
  },

  async requestReset(parent, args, ctx, info) {
    const email = args.email.toLowerCase()

    // 1. Check if the user exists
    const user = await db.query.user({ where: { email } })

    if (!user) {
      throw Error(`No such user found for email ${email}`)
    }

    // 2. Set a reset token and expiry on the user
    const resetToken = (await asyncRandomBytes(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // One hour from now

    const res = await db.mutation.updateUser({
      where: { email: user.email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // 3. Send an email with the reset token
    const resetTokenURL = `${
      process.env.FRONTEND_URL
    }/reset?resetToken=${resetToken}`

    const mailRes = await transport.sendMail({
      from: 'mark@lion-byte.com',
      to: user.email,
      subject: 'Reset Your Password',
      html: makeANiceEmail(`Your password reset token is here!
      \n\n
      <a href='${resetTokenURL}'>Reset your password here!</a>`)
    })

    // 4. Return the message
    return { message: 'Thanks!' }
  },

  async resetPassword(parent, args, ctx, info) {
    const { resetToken, password, confirmPassword } = args

    // 1. Check if passwords match
    if (password !== confirmPassword) {
      throw Error(`Um... the passwords don't match!`)
    }

    // 2. Check if reset token is valid
    // 3. Check if it has expired
    const [user] = await db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now()
      }
    })

    if (!user) {
      throw Error('This token is either invalid or expired!')
    }

    // 4. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 16)

    // 5. Save the new password and remove the old reset tokens
    const updatedUser = await db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    // 6. Generate JWT
    const token = jwt.sign({ id: updatedUser.id }, process.env.APP_SECRET)

    // 7. Save JWT as a cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // One year cookie
    })

    // 8. Return the user
    return updatedUser
  },

  async updatePermissions(parent, args, ctx, info) {
    // 1. Check if user is logged in
    // 2. Get the current User
    const currentUser = ctx.request.user

    if (!currentUser) {
      throw Error('You must be logged in!')
    }

    // 3. Check if they have permission to do so
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])

    // 4. Perform update
    return db.mutation.updateUser(
      {
        data: { permissions: { set: args.permissions } },
        where: { id: args.userId }
      },
      info
    )
  }
}

module.exports = { Mutation }
