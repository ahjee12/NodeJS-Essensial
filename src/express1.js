// @ts-check

const express = require('express')
const fs = require('fs')
const app = express()

const PORT = 5000

app.use('/', async (req, res, next) => {
  console.log('Middleware 1')
  const fileContent = await fs.promises.readFile()
  const requestedAt = new Date()
  // @ts-ignore
  req.requestedAt = requestedAt
  // @ts-ignore
  req.fileContent = fileContent
  next()
})

/* 수많은 middleware... */
app.use((req, res) => {
  console.log('Middleware 2')
  res.send(
    `Hello, express!!: Requestedd at ${req.requestedAt}, ${req.fileContent}`
  )
})

app.listen(PORT, () => {
  console.log(`The Express sever is listening at port : ${PORT}`)
})
