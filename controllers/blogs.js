const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const allBlogs = await Blog
    .find({})
    .populate('user', { username: true, name: true })

  response.json(allBlogs.map(b => b.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const newBlog = request.body
    if (typeof newBlog.likes !== 'number') {
      newBlog.likes = 0
    }
    if (typeof newBlog.url !== 'string' || typeof newBlog.title !== 'string') {
      response.status(400).end()
      return
    }

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
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blogId = request.params.id
    const blog = await Blog.findById(blogId)

    if (user && blog && user._id.toString() === blog.user.toString()) {
      await Blog.findByIdAndRemove(blogId)
      response.status(204).end()
    }
    else {
      response.status(401).json({ error: 'user and blog IDs don not match' })
    }
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
