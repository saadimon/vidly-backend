const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { User } = require("../models/user")
const _ = require('lodash')
const Joi = require('joi')

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    let user = await User.findOne({ email: req.body.email })
    console.log(user)
    if (!user) return res.status(400).send('Invalid Email or Password')
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid Email or Password')
    const token = user.genAuthToken()
    return res.send(token)
})

function validate(arg) {
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(32).required()
    })
    return schema.validate(arg)
}

module.exports = router