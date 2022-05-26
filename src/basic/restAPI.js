// @ts-check
/* eslint-disable no-console */
const express = require('express')
// const fs = require('fs')

const app = express()

// parse
// const bodyParser = require('body-parser')
app.use(express.json())
// app.use(bodyParser.json())

// src/public/users 있는 경우 users주소랑 겹치는 파일 이름이 있음 -> 그 아래로 내려가서 14파일 가져옴
// public prefix 를 따라야 한다고 지정해 줘야 함
// app.use(express.static('src/public'))

// pug
app.set('views', 'src/views')
app.set('view engine', 'pug')

const PORT = 5000

const userRouter = require('./routers/user')

//  users라는 prefix가 붙어있을 때만 동작
app.use('/users', userRouter)
app.use('/public', express.static('src/public'))

// error handling 4개 인자 받는 경우만 가능
app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500
  res.send(err.message)
})

app.listen(PORT, () => {
  console.log(`The Express sever is listening at port!! : ${PORT}`)
})
