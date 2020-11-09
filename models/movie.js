const mongoose = require('mongoose')
const Joi = require('joi')
const { genreSchema } = require('./genre')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 5,
        max: 50
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        default: 0
    }
})

const Movie = mongoose.model('Movies', movieSchema)

function validate(arg) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number()
    })
    return schema.validate(arg)
}

exports.Movie = Movie;
exports.validate = validate;
exports.movieSchema = movieSchema;