const mongoose = require('mongoose')
const winston = require('winston')
const config = require('config')

const dbString = config.get('db')
module.exports = function(){
    mongoose.connect(dbString, {useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true})
    .then(()=> winston.info(`connected to ${dbString}`))
}