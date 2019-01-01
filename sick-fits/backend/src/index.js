const cookieParser = require('cookie-parser')
const { resolve } = require('path')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: resolve(__dirname, '../variables.env') })

const { createServer } = require('./createServer')
const { db } = require('./db')

const server = createServer()
server.express.use(cookieParser())

// Decode the JWT to get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies

  if (token) {
    const { id } = jwt.verify(token, process.env.APP_SECRET)

    // Place the user Id on the req for future requests to access
    req.userId = id
  }

  next()
})

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  details => {
    console.log(
      `Server is now running on port http://localhost:${details.port}/`
    )
  }
)
