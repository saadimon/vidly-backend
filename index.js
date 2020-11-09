const express = require('express')
const app = express()
const winston = require('winston')


//error logging with winston
require('./startup/logging')()

//validation with Joi
require('./startup/validation')()

//config setting
require('./startup/config')()

//route handling
require('./startup/routes')(app)

//database initialization
require('./startup/database')()

//connect to server
const port = process.env.PORT || 3000
const server = app.listen(port, () => winston.info(`listening on port ${port}...`))

module.exports = server