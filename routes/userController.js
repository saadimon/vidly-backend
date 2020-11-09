const config = require('config')
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { validate, User } = require('../models/user')
const auth = require('../middleware/auth')

router.get('/me', auth, async (req, res) => {
    const user =  await User.findOne({_id: req.user._id}).select('-password')
    res.send(user) 
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    let user = await User.findOne({email: req.body.email})
    if(user) return res.status(400).send('User already registered')
    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()
    const token = user.genAuthToken();
    console.log("saved: ", user)
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']))
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, { new: true })
    if (!user) return res.status(400).send("User Not Found")
    res.send(user)
})

router.delete('/:id', auth, async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(400).send("User Not Found")
    res.send("deleted")
})

module.exports = router