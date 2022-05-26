// @ts-check
/* eslint-disable no-console */
const express = require('express')
// const fs = require('fs')

const multer = require('multer')

const upload = multer({ dest: 'uploads/' })

const router = express.Router()

const USERS = {
  15: { nickname: 'foo', profileImageKey: undefined, path: undefined },
  16: { nickname: 'bar', profileImageKey: undefined, path: undefined },
}

// 여러 api를 한 묶음으로 묶고자 할 때
// path type
router.get('/', (req, res) => {
  res.send('Root - GET')
})

// /:id에서 id가 param callback에 걸림
// unhandledPromise 오류
router.param('id', async (req, res, next, value) => {
  try {
    // console.log('id parameter', value)
    // @ts-ignore
    const user = USERS[value]
    if (!user) {
      const err = new Error('User not found!!')
      // @ts-ignore
      err.statusCode = 404
      throw err
    }
    // @ts-ignore
    req.user = user
    next()
  } catch (error) {
    // next에 error전달하기
    next(error)
  }
})

// users/15
router.get('/:id', (req, res) => {
  const resMimeType = req.accepts(['json', 'html'])

  if (resMimeType === 'json') {
    // send -> httpie에 응답
    // 자동 stringify
    // @ts-ignore
    res.send(req.user)
  } else if (resMimeType === 'html') {
    // pug 파일
    res.render('user-profile', {
      // @ts-ignore
      nickname: req.user.nickname,
      userId: req.params.id,
      // @ts-ignore
      // profileImageKeyURL: `/uploads/${req.user.profileImageKey}`,
      // profileImageKeyURL: `/${req.user.path}`,
      profileImageURL: `/uploads/${req.user.profileImageKey}`,
    })
  }
  console.log('userRouter get ID')
})

router.post('/', (req, res) => {
  // Register user
  res.send('User registered')
})

router.post('/:id/nickname', (req, res) => {
  // req: {userID: {"nickname" : "bar"}}
  // param 에서 req.user = user
  // @ts-ignore
  const { user } = req
  // JSON 형태로 POST 요청이 옴
  const { nickname } = req.body
  user.nickname = nickname
  res.send(`User nickname updated: ${nickname}`)
})

// upload!
router.post('/:id/profile', upload.single('profile'), (req, res) => {
  console.log(req.file)
  // param 에서 req.user = user
  // @ts-ignore
  const { user } = req
  // @ts-ignore
  const { filename, path } = req.file

  user.profileImageKey = filename
  user.path = path
  res.redirect(`/users/${req.params.id}`)
  // res.send(`User profile image uploaded: ${filename} and ${path}`)
})

module.exports = router
