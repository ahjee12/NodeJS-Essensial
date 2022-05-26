// @ts-check

// const { log } = console

// log(require('./convenModule'))

const fs = require('fs')
const util = require('util')
// callback style
// 지정 파일을 전부 읽고 나서야 콜백함수 실행됨
// fs.readFile('src/convenModule.jsx', 'utf-8', (err, result) => {
//   if (err) {
//     console.error(err)
//   } else {
//     console.log(result)
//   }
// })

// sync style
// try {
//   const result = fs.readFileSync('src/convention.jsx', 'utf-8')
//   console.log(result)
// } catch (error) {
//   console.log(error)
// }

// promise-style return 값이 promise 객체이기 때문에 async await사용 가능
async function main() {
  try {
    // const result = await fs.promises.readFile('src/convention.js', 'utf-8')
    const result = await util.promisify(fs.readFile)(
      'src/convention.js',
      'utf-8'
    )
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}
main()
