// @ts-check

const { log } = console
const fs = require('fs')

// 버퍼 사이즈 * 2
const rs = fs.createReadStream('src/local/big-file', {
  encoding: 'utf-8',
  highWaterMark: 65536 * 2,
})

/**
 * @type {Object<string, number>}
 */
const numBlocksPerCharacter = {
  a: 0,
  b: 0,
}

/** @type {string | undefined} */
let prevCharacter
let chunkCount = 0

// a가 담긴 buffer 형태로 data전달
rs.on('data', (data) => {
  chunkCount += 1

  if (typeof data !== 'string') {
    return
  }
  for (let i = 0; i < data.length; i += 1) {
    if (data[i] !== prevCharacter) {
      const newCharacter = data[i]
      if (!newCharacter) {
        /* eslint-disable-next-line no-continue */
        continue
      }
      prevCharacter = newCharacter
      numBlocksPerCharacter[newCharacter] += 1
    }
  }
})

// 읽기 끝남
rs.on('end', () => {
  log(`Event: end`)
  log(`blockCount`, numBlocksPerCharacter)
  log(`chunkCount`, chunkCount)
})
