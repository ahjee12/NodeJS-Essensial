// @ts-check
/* eslint-disable no-console */
const express = require('express')
// const fs = require('fs')

const app = express()

// parse
app.use(express.json())

// pug
app.set('views', 'src/views')
app.set('view engine', 'pug')

const userRouter = require('../routers/user')

//  users라는 prefix가 붙어있을 때만 동작
app.use('/users', userRouter)
app.use('/public', express.static('src/public'))
app.use('/uploads', express.static('uploads'))

// error handling
app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500
  res.send(err.message)
})

// express 방출
module.exports = app
