const express = require('express')
const router = express.Router()
const { validate, Movie } = require('../models/movie')
const { Genre } = require('../models/genre')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => res.send(await Movie.find()))

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(400).send("Movie Not Found")
    res.send(movie)
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const genre = await Genre.findById(req.body.genreId)
    console.log(genre)
    if (!genre) return res.status(400).send("Invalid Genre")
    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
    await movie.save()
    console.log("saved: ", movie)
    res.send(movie)
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const genre = await Genre.findById(req.body.genreId)
    if(!genre) return res.status(400).send('Invalid Genre')
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            genreId: genre.id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate 
    }, { new: true })
    if (!movie) return res.status(400).send("Movie Not Found")
    res.send(movie)
})

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(400).send("Movie Not Found")
    res.send("deleted")
})

module.exports = router