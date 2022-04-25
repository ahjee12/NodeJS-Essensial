// @ts-check

// 프레임 워크 없이 서버

/**
 * - 로컬 파일을 db로 씀: JSON
 * - 인증로직 없음
 * - restful API
 */

const http = require('http')

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

/** @type {Post[]} */
const posts = [
  {
    id: 'my_first_post',
    title: 'My first post',
    content: 'Hello',
  },
  {
    id: 'my_second_post',
    title: 'My second post',
    content: 'Hello',
  },
]

const server = http.createServer((req, res) => {
  console.log(req.url)
  console.log('Request accepted')

  const POST_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/
  const regexResult = (req.url && POST_ID_REGEX.exec(req.url)) || undefined

  if (req.url === '/posts' && req.method === 'GET') {
    // 1. 전체 host 읽기
    const result = {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
      })),
      totalCount: posts.length,
    }

    res.statusCode = 200
    // httpie는 JSON으로 stringify한 string을 plain텍스트로만 해석 -> setHeader -> JSON shape
    res.setHeader('Content-type', 'application/json; encoding=utf-8')
    res.end(JSON.stringify(result))
  } else if (regexResult && req.method === 'GET') {
    // 2. 하나의 host 읽기
    // GET /posts/:id
    const postId = regexResult[1]
    const post = posts.find((_post) => _post.id === postId)
    if (post) {
      res.statusCode = 200
      res.setHeader('Content-type', 'application/json; encoding=utf-8')
      res.end(JSON.stringify(post))
    } else {
      res.statusCode = 404
      res.end('Post not found')
    }
  } else if (req.url === '/posts' && req.method === 'POST') {
    // POST 만들기
    // POST /posts title='' content=''
    // buffer -> string
    req.setEncoding('utf-8')
    req.on('data', (data) => {
      // data는 JSON객체
      /** @typedef CreatePostBody
       *  @property {string} title
       *  @property {string} content
       */
      /** @type {CreatePostBody} */
      const body = JSON.parse(data)
      console.log(body)
      posts.push({
        id: body.title.toLowerCase().replace(/\s/g, '_'),
        title: body.title,
        content: body.content,
      })
    })
    res.statusCode = 200
    res.end('Creating post')
  } else {
    res.statusCode = 404
    res.end('Not found')
  }
  res.statusCode = 200
  res.end('Hello')
})

const PORT = 4000

server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}`)
})
