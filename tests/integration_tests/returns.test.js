const { Rental } = require('../../models/rental')
const { User } = require('../../models/user')
const { Movie } = require('../../models/movie')
const mongoose = require('mongoose')
const request = require('supertest')
const moment = require('moment')

describe('/api/returns', () => {
    let server
    let customerId
    let movieId
    let rental;
    let token;
    let movie;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId })
    }
    beforeEach(async () => {
        movie = new Movie({
            _id: movieId,
            title: 'abcde',
            genre: {
                name: 'abcde'
            },
            numberInStock: 10,
            dailyRentalRate: 5
        })
        token = new User().genAuthToken()
        customerId = new mongoose.Types.ObjectId
        movieId = new mongoose.Types.ObjectId
        server = require('../../index')
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        })
        await movie.save()
        await rental.save()
    })
    afterEach(async () => {
        server.close()
        await Rental.remove({})
        await Movie.remove({})
    })
    it('should return 401 if client not logged in!', async () => {
        token = ''
        const res = await exec()
        expect(res.status).toBe(401)
    })

    it('should return 400 if customerId is not provided', async () => {
        customerId = ''
        const res = await exec()
        expect(res.status).toBe(400)
    })
    it('should return 400 if movieId is not provided', async () => {
        movieId = ''
        const res = await exec()
        expect(res.status).toBe(400)
    })
    it('should return 404 if rental not found for customer/movie', async () => {
        await Rental.remove({})
        const res = await exec()
        expect(res.status).toBe(404)
    })
    it('should return 400 if rental has been processed', async () => {
        rental.dateReturned = new Date
        await rental.save()
        const res = await exec()
        expect(res.status).toBe(400)
    })
    it('should return 200 if valid request', async () => {
        const res = await exec()
        expect(res.status).toBe(200)
    })
    it('should save dateReturned', async () => {
        await exec()
        result = await Rental.findById(rental._id)
        let diff = new Date() - result.dateReturned
        expect(diff).toBeLessThan(10 * 1000)
    })
    it('should save correct rentalFee', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate()
        rental.save()
        await exec()
        result = await Rental.findById(rental._id)
        expect(result.rentalFee).toBe(14)
    })
    it('should increase movie numberInStock after return', async () => {
        await exec()
        movieResult = await Movie.findById(movieId)
        expect(movieResult.numberInStock).toBe(11)
    })

})