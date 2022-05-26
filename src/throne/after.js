/**
 * @typedef Character
 * @property {string} slug
 * @property {string} house
 * @property {string} quote
 * @property {number} polarity
 */

/**
 * @typedef House
 * @property {string} slug
 * @property {Character[]} members
 */

const https = require('https')

const GOTAPI_PREFIX = 'https://game-of-thrones-quotes.herokuapp.com/v1'

/**
 *
 * @param {string} url
 * @return {*}
 */
async function getHttpsJSON(url) {
  return new Promise((resolve, reject) => {
    // http에는 promises 존재하지 않음!
    https.get(url, (res) => {
      let jsonStr = ''
      res.setEncoding('utf-8')
      res.on('data', (data) => {
        jsonStr += data
      })
      res.on('end', () => {
        try {
          const parsed = JSON.parse(jsonStr)
          resolve(parsed)
        } catch {
          reject(
            new Error('The server response was not a valid JSON document!!')
          )
        }
      })
    })
  })
}

/**
 * @returns {Promise<House[]>}
 */
async function getHouse() {
  // await하지 않더라도 이미 promise를 return함
  return getHttpsJSON(`${GOTAPI_PREFIX}/houses`)
}

/**
 * @param {string} quote
 * @returns {string}
 */
function sanitizeQuote(quote) {
  return quote.replace(/[^a-zA-Z0-9., ]/g, '')
}

/**
 * @param {string} slug
 * @return {promise<string>}
 */
async function getMergedQuotesOfCharacter(slug) {
  const character = await getHttpsJSON(`${GOTAPI_PREFIX}/character/${slug}`)
  return sanitizeQuote(character[0].quotes.join(' '))
}

/**
 *
 * @param {string} quote
 */
async function getSentimAPIResult(quote) {
  return Promise((resolve, reject) => {
    const body = JSON.stringify({ text: quote })
    const postReq = https.request(
      {
        hostname: 'sentim-api.herokuapp.com',
        method: 'POST',
        path: '/api/v1/',
        headers: {
          Accept: 'application/json; encoding=utf-8',
          'Content-Type': 'application/json; encoding=utf-8',
          'Content-Length': body.length,
        },
      },
      (res) => {
        let jsonStr = ''
        res.setEncoding('utf-8')
        res.on('data', (data) => {
          jsonStr += data
        })
        res.on('end', () => {
          try {
            resolve(JSON.parse(jsonStr))
          } catch {
            reject(
              new Error('The server response was not a valid JSON document!!')
            )
          }
        })
      }
    )
    postReq.write(body)
  })
}

/**
 * @param {number[]} numbers
 * @returns {number}
 */
function sum(numbers) {
  return numbers.reduce((memo, curr) => memo + curr, 0)
}
async function main() {
  const houses = await getHouse()
  const characters = await Promise.all(
    houses
      .map((house) =>
        house.members.map((member) =>
          getMergedQuotesOfCharacter(member.slug).then((quote) => ({
            house: house.slug,
            member: member.slug,
            quote,
          }))
        )
      )
      .flat()
    /*  getMergedQuotes promise<pending>나옴
    houses
      .map((house) =>
        house.members.map((member) => ({
          house: house.slug,
          member: member.slug,
          quote: getMergedQuotesOfCharacter(member.slug),
        }))
      )
      .flat()
      */
  )
  console.log(characters)
  // Promise.all return배열
  const charactersWithPolarity = await Promise.all(
    characters.map(async (character) => {
      const result = await getSentimAPIResult(character.quote)
      return {
        ...character,
        polarity: result.result.polarity,
      }
    })
  )

  /** @type {Object.<string, Character[]>} */
  const charactersByHouseSlugs = {}
  charactersWithPolarity.forEach((character) => {
    /* 
    ★★★★
    {
      bolton:[
        {},
        {},
      ],
    }
    */
    charactersByHouseSlugs[character.house] =
      charactersByHouseSlugs[character.house] || []
    charactersByHouseSlugs[character.house].push(character)
  })

  // object key name만 따오기
  const houseSlugs = Object.keys(charactersByHouseSlugs)
  const result = houseSlugs
    .map((houseSlug) => {
      /*
      ★★★★
      [
        {},
        {},
        ...,
        {}
      ]
      */
      const charactersOfHouse = charactersByHouseSlugs[houseSlug]
      if (!charactersOfHouse) {
        return undefined
      }
      const sumPolarity = sum(
        charactersOfHouse.map((character) => character.polarity)
      )
      const averagePolarity = sumPolarity / charactersOfHouse.length
      return [houseSlug, averagePolarity]
    })
    .sort((a, b) => a[1] - b[1])

  console.log(result)
  /*
  houses.forEach((house) => {
    house.members.forEach((member) => {
      // {"name": "Jon Snow", "slug": "jon"}
      getMergedQuotesOfCharacter(member.slug)
      // async 함수 안에 있는 것이 아니기 때문에 await 못 씀!
      // .then(quote => console.log(house.slug, memeber.slug ,quotes))
    })
  })
  console.log(houses)
  */
}
main()
