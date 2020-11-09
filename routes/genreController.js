const express = require('express')
const router = express.Router()
const { validate, Genre } = require("../models/genre")
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateId = require('../middleware/validateId')

router.get('/', async (req, res) => res.send(await Genre.find()))

router.get('/:id', validateId, async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send("Genre Not Found")
    res.send(genre)
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const genre = new Genre({ name: req.body.name })
    await genre.save()
    console.log("saved: ", genre)
    res.send(genre)
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if (!genre) return res.status(404).send("Genre Not Found")
    res.send(genre)
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id)
    if (!genre) return res.status(404).send("Genre Not Found")
    res.send("deleted")
})

module.exports = router