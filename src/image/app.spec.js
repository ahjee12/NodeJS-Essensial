/* eslint-disable no-undef */
/* eslint-disable node/no-unpublished-require */
// spec 또는 test
const supertest = require('supertest')

const app = require('./image')

// express 테스트
const request = supertest(app)

// 원하는 형태로 JSON형태가 만들어 졌는지
test('retrieve user json', async () => {
  const result = await request.get('/users/14').accept('application/json')

  console.log(result)
  console.log(result.body)

  expect(result.body).toMatchObject({
    nickname: expect.any(String),
  })
})

test('retrieve user page', async () => {
  const result = await request.get('/users/14').accept('text/html')

  console.log(result)
  // console.log(result.body)
  console.log(result.text)

  expect(result.text).toMatch(/^<html>.*<\/html>$/)
})

test('update nickname', async () => {
  const newNickname = 'newNickNick'
  const res = await request
    .post('/users/14/nickname')
    .send({ nickname: newNickname })
  expect(res.status).toBe(200)

  const userResult = await request.get('/users/14').accept('application.json')
  expect(userResult.status).toBe(200)
  expect(userResult.body).toMatchObject({
    nickname: newNickname,
  })
})
