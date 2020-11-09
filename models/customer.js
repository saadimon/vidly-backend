const mongoose = require('mongoose')
const Joi = require('joi')
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: Number,
        required: true
    }
})

const Customer = mongoose.model('Customer', customerSchema)

function validate(arg) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.number()
    })
    return schema.validate(arg)
}

exports.Customer = Customer;
exports.validate = validate;
exports.customerSchema = customerSchema;