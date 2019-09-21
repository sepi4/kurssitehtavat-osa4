const blogsRouter = require('express').Router()
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
    const newBlog = request.body
    // const user = await User.findById(newBlog.userId)
    const users = await User.find({}) // TODO
    const user = users[0]

    if (typeof newBlog.likes !== 'number') {
      newBlog.likes = 0
    }
    if (typeof newBlog.url !== 'string' || typeof newBlog.title !== 'string') {
      response.status(400).end()
      return
    }

    console.log('--------', users[0])

    const blog = new Blog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
      likes: newBlog.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = [ ...user.blogs, savedBlog._id ]
    response.status(201).json(savedBlog.toJSON())
    await user.save()
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
