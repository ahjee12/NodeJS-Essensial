// @ts-check

const { MongoClient } = require('mongodb')

const uri =
  'mongodb+srv://ahjee12:1111@cluster0.3jj88.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

/*
client.connect((err) => {
  const collection = client.db('test').collection('devices')
  console.log(collection)
  console.log(`OK!`)
  // perform actions on the collection object
  client.close()
})
*/

async function main() {
  await client.connect()
  console.log('OK!')
  const users = client.db('fastCampus').collection('users')
  const cities = client.db('fastCampus').collection('cities')

  await users.deleteMany({})
  await cities.deleteMany({})

  // Init
  await cities.insertMany([
    {
      name: 'seoul',
      population: 1000,
    },
    {
      name: 'busan',
      population: 350,
    },
  ])

  // reset
  await users.insertMany([
    {
      name: 'Foo',
      birthYear: 2000,
      contacts: [
        { type: 'firm', number: '+8211111111' },
        { type: 'home', number: '+8213333333' },
      ],
      city: 'seoul',
    },
    {
      name: 'Bar',
      birthYear: 1995,
      contacts: [{ type: 'home', number: '+923333333' }],
      city: 'busan',
    },
    {
      name: 'Baz',
      birthYear: 1980,
      city: 'busan',
    },
    {
      name: 'Poo',
      birthYear: 1993,
      city: 'seoul',
    },
  ])

  // await users.deleteOne({ name: 'Baz' })
  // await users.updateOne({ name: 'Baz' }, { $set: { name: 'Boo' } })
  // const cursor = users.find(
  //   { birthYear: { $gte: 1990 } },
  //   { sort: { birthYear: -1 } }
  // )
  // const cursor = users.find({ 'contacts.type': 'home' })

  // 연산자는 하나의 객체를 이뤄야 함 / 연산자 밖
  const cursor = users.aggregate([
    {
      $lookup: {
        from: 'cities',
        localField: 'city',
        foreignField: 'name',
        as: 'city_info',
      },
    },
    {
      $match: {
        $and: [
          {
            'city_info.population': {
              $gte: 500,
            },
          },
          {
            birthYear: {
              $gte: 1995,
            },
          },
        ],
      },
    },
    {
      $count: 'num_users',
    },
  ])

  await cursor.forEach(console.log)
  await client.close()
}

main()
