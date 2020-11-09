const express = require('express')
const router = express.Router()
const { Rental } = require('../models/rental')
const { Movie } = require('../models/movie')
const auth = require('../middleware/auth')
const moment = require('moment')

router.post('/', auth, async (req, res) => {
    if (!req.body.movieId) return res.status(400).send('movieId missing')
    if (!req.body.customerId) return res.status(400).send('customerId missing')
    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    })
    if (!rental) return res.status(404).send('rental not found')
    if (rental.dateReturned) return res.status(400).send('request already processed')
    rental.dateReturned = new Date()
    const daysRented = moment().diff(rental.dateOut, 'days')
    const rate = rental.movie.dailyRentalRate
    rental.rentalFee = daysRented * rate
    await rental.save()
    await Movie.findByIdAndUpdate(movieId, {
        $inc: { numberInStock: 1 }
    })
    res.status(200).send('Request processed')
})

module.exports = router