const request = require('supertest')
const { User } = require('../../models/user')
const { Genre } = require('../../models/genre')

let server
describe('auth middleware', () => {
    beforeEach(() => { server = require('../../index') })
    afterEach(async () => {
        await Genre.remove({})
        await server.close()
    })

    let token
    const exec = () => {
        return request(server)
            .post('/api/genre')
            .set('x-auth-token', token)
            .send({ name: 'genre1' })
    }
    beforeEach(() => {
        token = new User().genAuthToken()

    })
    it('should generate 401 if no token is provided', async () => {
        token = '';
        const res = await exec()
        expect(res.status).toBe(401)
    })
    it('should generate 400 if invalid token is provided', async () => {
        token = 'avs';
        const res = await exec()
        expect(res.status).toBe(400)
    })
    it('should respond with 200 if valid token', async () => {
        const res = await exec()
        expect(res.status).toBe(200)
    })
})
