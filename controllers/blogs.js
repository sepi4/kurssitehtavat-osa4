const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const allBlogs = await Blog
    .find({})
    .populate('user', { username: true, name: true })

  response.json(allBlogs.map(b => b.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const newBlog = request.body

    const token = getTokenFrom(request)

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    // const user = await User.findById(newBlog.userId)
    // const users = await User.find({}) // TODO
    // const user = users[0]

    if (typeof newBlog.likes !== 'number') {
      newBlog.likes = 0
    }
    if (typeof newBlog.url !== 'string' || typeof newBlog.title !== 'string') {
      response.status(400).end()
      return
    }

    // console.log('--------', users[0])

    const blog = new Blog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
      likes: newBlog.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = [ ...user.blogs, savedBlog._id ]
    await user.save()
    response.status(201).json(savedBlog.toJSON())
  }
  catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    await Blog.findByIdAndRemove(id)
    response.status(204).end()
  }
  catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
    response.json(updatedBlog.toJSON())
  }
  catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter
