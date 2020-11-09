const genreController = require('../routes/genreController')
const customersController = require('../routes/customersController')
const moviesController = require('../routes/moviesController')
const rentalsController = require('../routes/rentalsController')
const userController = require('../routes/userController')
const authController = require('../routes/authController')
const returnsController = require('../routes/returnsController')
const error = require('../middleware/error')
const express = require('express')

module.exports = function (app) {
    //route handling and middleware
    app.use(express.json())
    app.use('/api/genre', genreController)
    app.use('/api/customers', customersController)
    app.use('/api/movies', moviesController)
    app.use('/api/rentals', rentalsController)
    app.use('/api/users', userController)
    app.use('/api/auth', authController)
    app.use('/api/returns', returnsController)
    app.get('/', (req, res) => res.send("Hello Vidly"))
    app.use(error)
}