const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    console.log('yhteys tietokantaan saatu')
  })
  .catch(err => {
    console.log('virhe yhteysotossa tietokantaan', err.message)
  })

app.use(cors())
app.use(bodyParser.json())

app.use('', blogsRouter)

module.exports = app
