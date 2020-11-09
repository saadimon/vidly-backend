const express = require('express')
const router = express.Router()
const { Rental , validate } = require('../models/rental')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')
const Fawn = require('fawn')
const mongoose = require('mongoose')

Fawn.init(mongoose)

router.get('/', async (req, res) => res.send(await Rental.find().sort('-dateOut')))

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id)
    if (!rental) return res.status(400).send("Movie Not Found")
    res.send(rental)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(400).send("Invalid Movie")
    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(400).send("Invalid Genre")
    if (movie.numberInStock === 0) return res.status(400).send('Movie out of stock')
    let rental = new Rental({
        Movie: {
            _id: movie.id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        Customer: {
            _id: customer.id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        dateOut: Date.now
    })
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run()
        res.send(rental)
    }
    catch { err => res.status(500).send('internal service error') }
})


module.exports = router