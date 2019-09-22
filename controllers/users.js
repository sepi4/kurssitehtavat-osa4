const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { author: true, title: true, url: true })

    response.json(users.map(u => u.toJSON()))

    // const allUsers = await User.find({})
    // response.json(allUsers.map(u => u.toJSON()))
  }
  catch (exception){
    next(exception)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    if (!body.password || body.password.length < 3) {
      return response.status(400).json({ error: 'bad user parameters' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()
    // response.status(201).json(savedUser.toJSON())
    response.status(201).json(savedUser)

  }
  catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter
