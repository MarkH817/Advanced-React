const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

/**
 * Create an email from the template
 * @param {string} message
 * @returns {string}
 */
const makeANiceEmail = message =>
  `<div class='email' style='border: 1px solid black; padding: 20px; font-family: sans-serif; line-height: 2; font-size: 20px;'>
  <h2>Hello There!</h2>

  <p>${message}</p>

  <p>:3c, Mark Hernandez</p>
</div>`

module.exports = { transport, makeANiceEmail }
