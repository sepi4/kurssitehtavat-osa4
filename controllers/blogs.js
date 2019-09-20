const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({})
  response.json(allBlogs.map(b => b.toJSON()))

  // Blog
  //   .find({})
  //   .then(blogs => {
  //     response.json(blogs.map(b => b.toJSON()))
  //   })
})

blogsRouter.post('/', async (request, response) => {
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

  // .save()
  // .then(savedBlog => {
  //   response.status(201).json(savedBlog.toJSON())
  // })
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    await Blog.findByIdAndRemove(id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter
