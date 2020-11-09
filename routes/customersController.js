const express = require('express')
const router = express.Router()
const { Customer, validate } = require('../models/customer')

router.get('/', async (req, res) => res.send(await Customer.find()))

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(400).send("Customer Not Found")
    res.send(customer)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })
    await customer.save()
    console.log("saved: ", customer)
    res.send(customer)
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }, { new: true })
        if (!customer) return res.status(400).send("Customer Not Found")
        res.send(customer)
    }
    catch { err => err.message }
})

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) return res.status(400).send("Customer Not Found")
    res.send("deleted")
})

module.exports = router