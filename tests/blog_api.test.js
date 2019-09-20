const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

beforeEach(async () => {
  // poistetaan kaikki blogit testitietokannasta
  await Blog.deleteMany({})

  // lisataan uudet blogit testitietokantaan
  for (let i = 0; i < initialBlogs.length; i++) {
    const b = new Blog(initialBlogs[i])
    await b.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test(`there are ${initialBlogs.length} blogs`, async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(initialBlogs.length)
})

test(`one of blogs title is '${initialBlogs[0].title}'`, async () => {
  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)
  expect(titles).toContain(initialBlogs[0].title)
})

test(`author of one of the blogs is ${initialBlogs[1].author}`, async () => {
  const response = await api.get('/api/blogs')
  const authors = response.body.map(r => r.author)
  expect(authors).toContain(initialBlogs[1].author)
})

test(`author of one of the blogs is ${initialBlogs[1].author}`, async () => {
  const response = await api.get('/api/blogs')
  const authors = response.body.map(r => r.author)
  expect(authors).toContain(initialBlogs[1].author)
})

test('check that  "blog.id" is defined', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]
  expect(firstBlog.id).toBeDefined()
})

test('add blog, check new length', async () => {
  const newBlog = {
    title: 'Kissa Istuu',
    author: 'Vesa Lappalainen',
    url: 'www.jyu.fi',
    likes: 99,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    // .expect(201)
    // .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(initialBlogs.length + 1)
})



test('add blog, check and new containing ', async () => {
  const newBlog = {
    title: 'Kissa Istuu',
    author: 'Vesa Lappalainen',
    url: 'www.jyu.fi',
    likes: 99,
  }
  await api.post('/api/blogs').send(newBlog)
  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title)
  expect(titles).toContain(newBlog.title)
})

test('undefined likes should turn into 0', async () => {
  const newBlog = {
    title: 'Kissa Istuu',
    author: 'Vesa Lappalainen',
    url: 'www.jyu.fi',
  }
  const added = await api
    .post('/api/blogs')
    .send(newBlog)

  const response = await api.get('/api/blogs')
  const addedBlog = response.body.find(b => b.id === added.body.id)
  expect(addedBlog.likes).toBe(0)
})

test('newBlog does not have url value', async () => {
  const newBlog = {
    author: 'Vesa Lappalainen',
    likes: 11
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('delete a blog', async () => {
  const response = await api.get('/api/blogs')
  const id =  response.body[0].id
  await api
    .delete(`/api/blogs/${id}`)
    .expect(204)

  const newResponse = await api.get('/api/blogs')
  const newIdList = newResponse.body.map(b => b.id)
  expect(newIdList).not.toContain(id)
})

test('update a blog', async () => {
  const response = await api.get('/api/blogs')
  const id =  response.body[0].id
  const blog = response.body[0]
  // oldLikes = blog.likes
  const newLikes = 99999
  const newBody = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: newLikes
  }
  await api
    .put(`/api/blogs/${id}`)
    .send(newBody)
    .expect(200)

  const newResponse = await api.get('/api/blogs')
  const updatedBlog = newResponse.body.find(b => b.id === id)
  expect(updatedBlog.likes).toBe(newLikes)
})

afterAll(() => {
  mongoose.connection.close()
})

