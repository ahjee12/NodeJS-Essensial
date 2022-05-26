// @ts-check

// 스트림으로 큰 파일 처리하기!

const fs = require('fs')

const ws = fs.createWriteStream('src/local/big-file')

// const NUM_MBYTES = 500
const NUM_BLOCKS = 500
/**
 * @type {Object<string, number>}
 */
const numBlocksPerCharacter = {
  a: 0,
  b: 0,
}

for (let i = 0; i < NUM_BLOCKS; i += 1) {
  // ws.write('Hello, world')
  const blockLength = Math.floor(800 + Math.random() * 200)
  const character = i % 2 === 0 ? 'a' : 'b'
  ws.write(character.repeat(1024 * blockLength))

  numBlocksPerCharacter[character] += 1
}
console.log(numBlocksPerCharacter)
// aaaaaabbbbbbaaaaaaabbbbbbbbaaaaaaaabbbb....abbb
