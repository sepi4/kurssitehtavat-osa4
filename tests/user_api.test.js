const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    name: 'Sergei Polishsuk',
    username: 'sergei',
    password: 'salainen',
  },
  {
    name: 'Stina Palomaki',
    username: 'stina',
    password: 'salainen',
  },
  {
    username: 'root',
    password: 'salasana',
  }
]


beforeEach(async () => {
  // poistetaan kaikki kayttajat testitietokannasta
  await User.deleteMany({})

  // lisataan uudet blogit testitietokantaan
  for (let i = 0; i < initialUsers.length; i++) {
    const user = new User(initialUsers[i])
    await user.save()
  }
})

test('create user with too short password', async () => {
  const newUser = {
    username: 'hullu',
    password: 'p',
  }
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('bad user parameters')

  const response = await api.get('/api/users')
  expect(response.body.length).toBe(initialUsers.length)
})

test('create user with too short username', async () => {
  const newUser = {
    username: 'h',
    password: 'password',
  }
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('minimum allowed length')

  const response = await api.get('/api/users')
  expect(response.body.length).toBe(initialUsers.length)
})

test('create user with no username', async () => {
  const newUser = {
    password: 'password',
  }
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('User validation failed: username')

  const response = await api.get('/api/users')
  expect(response.body.length).toBe(initialUsers.length)
})


test('try create not unique user', async () => {
  const newUser = {
    username: 'root',
    password: 'root',
  }
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('expected `username` to be unique')

  const response = await api.get('/api/users')
  expect(response.body.length).toBe(initialUsers.length)
})

test('create user correctly', async () => {
  const newUser = {
    username: 'kissa',
    password: 'kissa',
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const response = await api.get('/api/users')
  expect(response.body.length).toBe(initialUsers.length + 1)
})


afterAll(() => {
  mongoose.connection.close()
})
