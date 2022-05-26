// @ts-check

const Koa = require('koa')
const path = require('path')
const Pug = require('koa-pug')

const route = require('koa-route')
const websockify = require('koa-websocket')

const serve = require('koa-static')

const mount = require('koa-mount')

const app = websockify(new Koa())

const mongoClient = require('./mongoSocket')

// pug(viewPath) directory 설정
// @ts-ignore
// eslint-disable-next-line no-new
new Pug({
  viewPath: path.resolve(__dirname, '../views'),

  app, // Binding `ctx.render()`, equals to pug.use(app) ctx.render할 때 pug참조 가능
})

// app.use(serve('src/public'))
app.use(mount('/public', serve('src/public')))

app.use(async (ctx) => {
  await ctx.render('main')
})

/* eslint-disable-next-line no-underscore-dangle */
const _client = mongoClient.connect()

async function getChatCollection() {
  console.log(`mongo!`)
  const client = await _client
  return client.db('chat').collection('chats')
}

// Using routes
app.ws.use(
  route.all('/ws', async (ctx) => {
    // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
    // the websocket is added to the context on `ctx.websocket`.

    const chatsCollection = await getChatCollection()
    const chatsCursor = chatsCollection.find(
      {},
      {
        sort: {
          createdAt: 1,
        },
      }
    )
    const chats = await chatsCursor.toArray()
    console.log(chats)
    ctx.websocket.send(
      JSON.stringify({
        type: 'sync',
        payload: { chats },
      })
    )

    // ★
    ctx.websocket.on('message', async (data) => {
      console.log(data.toString())
      console.log(data)
      // do something with the message from client(web이 send한 것!!!)
      // Argument of type 'RawData' is not assignable to parameter of type 'string'.  Type 'Buffer' is not assignable to type 'string'

      // @ts-ignore
      const chat = JSON.parse(data)
      // 서버가 다시 살아나도 chat element살아있을 수 있어야 함, client가 언제 접속하든 같은 chat element를 받을 수 있어야 함
      await chatsCollection.insertOne({
        ...chat,
        createAt: new Date(),
      })
      const { message, nickname } = chat

      // 서버에 물려있는 모든 socket에 같은 정도 내려주기
      const { server } = app.ws
      if (!server) {
        return
      }
      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'chat',
            payload: {
              message,
              nickname,
            },
          })
        )
      })

      /*
      ctx.websocket.send(
        JSON.stringify({
          message, 
          nickname,
        })
      )
      */
    })
  })
)

app.listen(3000)
