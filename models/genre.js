const mongoose = require('mongoose')
const Joi = require('joi')

const genreSchema = new mongoose.Schema({
    name: String
})

const Genre = mongoose.model('Genre', genreSchema)

function validate(arg){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate(arg)
}

exports.validate = validate
exports.Genre = Genre
exports.genreSchema = genreSchema