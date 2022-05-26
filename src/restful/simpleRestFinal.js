const http = require('http')
const { routes } = require('./api')

const server = http.createServer((req, res) => {
  async function main() {
    const route = routes.find(
      (_route) =>
        req.url &&
        req.method &&
        _route.url.test(req.url) &&
        _route.mehtod === req.method
    )

    if (!route) {
      res.statusCode = 404
      res.end('Not found')
      return // return 하면 그 뒤로는 route는 무조건 true값이라고 판단
    }

    const regexResult = route.url.exec(req.url)

    if (!regexResult) {
      res.statusCode = 404
      res.end('Not found')
      return
    }

    /** @type {Object.<string, *> | undefined} */
    const reqBody =
      (req.headers['content-type'] === 'application/json' &&
        (await new Promise((resolve, reject) => {
          req.setEncoding('utf-8')
          req.on('data', (data) => {
            try {
              resolve(JSON.parse(data))
            } catch {
              reject(new Error('Ill-formed json'))
            }
          })
        }))) ||
      undefined

    // result에 APIResponse형태 객체 저장
    // 1. 바깥 함수에서 함수를 인자로 받아 호출되는 형태
    // 2. 객체 method로 호출되는 형태
    const result = await route.callback(regexResult, reqBody)
    res.statusCode = result.statusCode
    // res.end는 string인자를 받음 빈 객체 {} 받을 경우 오류남
    if (typeof result.body === 'string') {
      res.end(result.body)
    } else {
      res.setHeader('Content-type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(result.body))
    }
    res.end(result.body)
  }

  main()
})

const PORT = 4000

server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}`)
})
