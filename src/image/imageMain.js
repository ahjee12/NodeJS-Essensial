// @ts-check

const app = require('./image')

const PORT = 5000

// port가 열려 있으면 jest가 안 끝남
app.listen(PORT, () => {
  console.log(
    `The Express "appSpecMain" sever is listening at port!! : ${PORT}`
  )
})
