const request = require('supertest');
const { Genre } = require('../../models/genre')
const { User } = require('../../models/user')
let server

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index') });
    afterEach(async () => {
        await Genre.remove({})
        await server.close()
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ])
            const res = await request(server).get('/api/genre')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some((g) => g.name === 'genre1')).toBeTruthy()
            expect(res.body.some((g) => g.name === 'genre2')).toBeTruthy()
        })
        describe('GET/:id', () => {
            it('should return genre with correct id', async () => {
                genre = new Genre({ name: 'genre1' })
                await genre.save()
                const res = await request(server).get('/api/genre/' + genre._id)
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('name', genre.name)
            })
            it('should return 404 with incorrect id', async () => {
                const res = await request(server).get('/api/genre/1234')
                expect(res.status).toBe(404)
            })
        })
    })
    describe('POST /', () => {
        it('should return 401 if client is not logged in', async () => {
            const res = await request(server).post('/api/genre').send({ name: 'genre1' })
            expect(res.status).toBe(401)
        })
        it('should return 400 if wrong input', async () => {
            const user = new User({name: 'abcde', email:'123@gmail.com', password: '1234', isAdmin: true});
            const token = user.genAuthToken()
            const res = await request(server)
                .post('/api/genre')
                .set('x-auth-token', token)
                .send({ abc: 'genre1' })
            expect(res.status).toBe(400)
        })
        it('should save genre if valid', async () => {
            const user = new User({name: 'abcde', email:'123@gmail.com', password: '1234', isAdmin: true});
            const token = user.genAuthToken()
            const res = await request(server)
                .post('/api/genre')
                .set('x-auth-token', token)
                .send({ name: 'genre1' })
            const genre = Genre.find({name: 'genre1'})
            expect(res.status).toBe(200)
            expect(genre).not.toBeNull()
        })
        it('should return the genre if valid', async () => {
            const user = new User({name: 'abcde', email:'123@gmail.com', password: '1234', isAdmin: true});
            const token = user.genAuthToken()
            const res = await request(server)
                .post('/api/genre')
                .set('x-auth-token', token)
                .send({ name: 'genre1' })
            const genre = Genre.find({name: 'genre1'})
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id')
        })

    })
    describe('PUT/:id', ()=>{
        it('should return 400 if data is not valid', async ()=>{
            genre = new Genre({ name: 'genre1' })
            await genre.save()
            const token = new User().genAuthToken()
            const res = await request(server)
            .put('/api/genre/' + genre._id)
            .set('x-auth-token', token)
            .send({x: 'asd'})

        expect(res.status).toBe(400)
        })
        it('should return 404 if genre not found',async ()=>{
            genre = new Genre({ name: 'genre1' })
            //await genre.save()
            const token = new User().genAuthToken()
            const res = await request(server)
            .put('/api/genre/' + genre._id)
            .set('x-auth-token', token)
            .send({name: 'asd'})

        expect(res.status).toBe(404)
        })
        it('should return edited genre if valid',async ()=>{
            genre = new Genre({ name: 'genre1' })
            await genre.save()
            const token = new User().genAuthToken()
            const res = await request(server)
            .put('/api/genre/' + genre._id)
            .set('x-auth-token', token)
            .send({name: 'asd'})

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('name', 'asd')
        })
    })
    describe('DELETE/:id',()=>{
        it('should return 404 if not found', async ()=>{
            genre = new Genre({ name: 'genre1' })
            //await genre.save()
            const token = new User({isAdmin: true}).genAuthToken()
            const res = await request(server)
            .delete('/api/genre/' + genre._id)
            .set('x-auth-token', token)

            expect(res.status).toBe(404)
        })
        it('should return 200 if found and deleted', async ()=>{
            genre = new Genre({ name: 'genre1' })
            await genre.save()
            const token = new User({isAdmin: true}).genAuthToken()
            const res = await request(server)
            .delete('/api/genre/' + genre._id)
            .set('x-auth-token', token)
            expect(res.status).toBe(200)
        })
    })
})

