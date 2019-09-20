const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({})
  response.json(allBlogs.map(b => b.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const newBlog = request.body

    if (typeof newBlog.likes !== 'number') {
      newBlog.likes = 0
    }
    if (typeof newBlog.url !== 'string' || typeof newBlog.title !== 'string') {
      response.status(400).end()
      return
    }

    const blog = new Blog(newBlog)
    const savedBlog = await blog.save()
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
