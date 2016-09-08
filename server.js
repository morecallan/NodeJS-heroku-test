'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const dateFormat = require('dateformat')

//middleware function of the routes in routes/index.js
const routes = require('./routes/');
const app = express()

// Get port from environment and store in Express.
const port = process.env.PORT || 3000
app.set('port', port)

// pug configuration
app.set('view engine', 'pug')

if (process.env.NODE_ENV !== 'production') {
  app.locals.pretty = true
}

app.locals.company = '🍕 Pizza de Scott'

// middlewares
app.use((req,res,next)=> {
  console.log(`[${new Date()}] "${chalk.cyan(req.method)} ${chalk.cyan(req.url)}" "${req.headers[`user-agent`]}"`)
  next()
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(routes)


app.use((req,res,next)=> {
  const err = new Error('Not found.')
  err.status = 404;
  res.render('404')
  next(err)
})

app.use((err,req,res,next)=> {
  res.sendStatus(err.status || 500)
  console.error(`[${new Date()}] "${chalk.red(req.method)} ${chalk.red(req.url)}" "Error: (${chalk.red(res.statusCode)}) ${chalk.red(res.statusMessage)}"`)
})

// Listen to requests on the provided port and log when available
app.listen(port, () =>
  console.log(`Listening on port: ${port}`)
)
