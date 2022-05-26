// @ts-check

const { MongoClient } = require('mongodb')

const uri =
  'mongodb+srv://ahjee12:1111@cluster0.3jj88.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

module.exports = client
