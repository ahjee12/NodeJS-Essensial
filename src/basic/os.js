// @ts-check

// const os = require('os')

// console.log(
//   ['arch', os.arch()],
//   ['platform', os.platform()],
//   ['cpus', os.cpus()]
// )

// const dns = require('dns')

// dns.lookup('google.com', (err, address, family) => {
//   console.log('address: %j family: IPv%s', address, family)
// })
// // address: "93.184.216.34" family: IPv4

const path = require('path')
const fs = require('fs')

// 절대경로 만들기
const filePath = path.resolve(__dirname, './test.txt')
console.log(`filePath: `, filePath)

// ./test.txt 경로 넣었을 때 NodeJS Essential아래에서 찾음 - pwd 보기
const fileContent = fs.readFileSync(filePath, 'utf-8')
console.log(fileContent)
