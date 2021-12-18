const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

test('sanity', () => {
  expect(true).toBe(true)
});

beforeAll( async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
});

beforeEach( async () => {
  await request(server).post('/api/auth/register')
    .send({username: "Dani", password: "MyNameIsNotSlimShady"})
});

afterAll( async () => {
  await db.destroy()
});

describe('[GET] /jokes', () => {
  let res
  beforeEach(async () => {
    res = await request(server).get('/api/jokes')
  })
  it('responds with 200 ok', async () => {
    expect(res.status).toBe(200)
  })
  it('responds with all jokes', async () => {
    expect(res.body).toHaveLength(3)
  })
})

describe('[POST] /register', () => {
  it('adds user to database', async () => {
    const users = await db('users')
    expect(users).toHaveLength(1)
  })
  it('responds with newly created user', async () => {
    const users = await db('users')
    expect(users[0].username).toEqual('Dani')
  })
})

describe('[POST] /login', () => {
  let login
  beforeEach( async () => {
    login = await request(server).post('/api/auth/login')
      .send({
        username: "Dani",
        password: "MyNameIsNotSlimShady"
      })
  })
  it('user can login successfully', async () => {
    expect(login.text).toMatch('token')
  })
  it('responds with successful login message', async () => {
    expect(login.text).toMatch('welcome back, Dani')
  })
})