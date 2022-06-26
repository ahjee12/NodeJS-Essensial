// @ts-check

/* 키워드 */
const fs = require('fs')
const path = require('path')
const http = require('http')
const { createApi } = require('unsplash-js')
// require은 node module에 씀 es module인 경우는 default
// downgrade node-fatch
const { default: fetch } = require('node-fetch')
// const sharp = require('sharp')
const { pipeline } = require('stream')
const { promisify } = require('util')
const sharp = require('sharp')

const unsplash = createApi({
  accessKey: 'XNyze6tZUAYA2QpGg80ZZP-jgEJae44RT0UQdSGAniY',
  // @ts-ignore
  fetch,
})

/**
 * @param {string} query
 */
async function searchImage(query) {
  const result = await unsplash.search.getPhotos({ query })

  if (!result.response) {
    throw new Error('Failed to search image.')
  }
  // object containing the data
  // console.log(result.response)
  // JSON / feed
  // console.log(result.response?.results)

  const image = result.response.results[0]
  if (!image) {
    throw new Error('No image found')
  }
  // console.log(image)

  return {
    description: image.description || image.alt_description,
    url: image.urls.regular,
  }
}

/**
 * 이미지를 Unsplash에서 검색하고 캐시된 이미지를 리턴
 * @param {string} query
 */
async function getCachedImageOrSearchedImage(query) {
  // 이미지 저장 path.resolve -> 절대 경로
  const imageFilePath = path.resolve(__dirname, `../resizeImages/${query}`)
  console.log(imageFilePath)
  // 기존 이미지 파일 있다면 파일 돌려줌
  // const stat = await fs.promises.stat(imageFilePath)
  if (fs.existsSync(imageFilePath)) {
    return {
      message: `Returning cached image: ${query}`,
      stream: fs.createReadStream(imageFilePath),
    }
  }
  const result = await searchImage(query)
  // http get / fetch는 brower api와 거의 비슷
  const response = await fetch(result.url)
  // await 사용할 수 없는 형태
  // response.body.pipe(fs.createWriteStream(imageFilePath))
  console.log(response.body)
  await promisify(pipeline)(response.body, fs.createWriteStream(imageFilePath))

  return {
    message: `Returning new image: ${query}`,
    stream: fs.createReadStream(imageFilePath),
  }
}

/**
 * @param {string} url
 */
function convertURLToImageInfo(url) {
  const urlObj = new URL(url, 'http://localhost:5000')
  console.log(urlObj)

  /**
   *
   * @param {string} name
   * @param {number} defaultValue
   * @returns
   */
  function getSearchParam(name, defaultValue) {
    const str = urlObj.searchParams.get(name)
    return str ? parseInt(str, 10) : defaultValue
  }

  const width = getSearchParam('width', 400)
  const height = getSearchParam('height', 400)

  // console.log(url)
  return {
    query: urlObj.pathname.slice(1),
    width,
    height,
  }
}

const server = http.createServer((req, res) => {
  async function main() {
    if (!req.url) {
      res.statusCode = 400
      res.end('Needs URL')
      return
    }
    console.log(typeof req.url)
    console.log(req.url)
    const { query, width, height } = convertURLToImageInfo(req.url)
    try {
      const { message, stream } = await getCachedImageOrSearchedImage(query)
      console.log(message, width, height)
      // promisify(pipeline)(stream, sharp().resize(width).png())
      await promisify(pipeline)(
        stream,
        sharp().resize(width, height).png(),
        res
      )
      // res
      // respond.body.pipe(
      //   fs.createWriteStream('')
      // )
      // getCashed까지 두 번 반복
      stream.pipe(res)
    } catch {
      res.statusCode = 400
      res.end()
    }
  }

  main()
})
const PORT = 5000

server.listen(PORT, () => {
  console.log('The server is listening at port ', PORT)
})
