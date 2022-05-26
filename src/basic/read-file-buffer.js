// @ts-check
const { log } = console
const fs = require('fs')

// prevCharacter is string -> utf-8
// Big buffer is put on the memory
// also applies on network system
const data = fs.readFileSync('src/local/big-file', 'utf-8')

/**
 * @type {Object<string, number>}
 */
const numBlocksPerCharacter = {
  a: 0,
  b: 0,
}

/** @type {string | undefined} */
let prevCharacter

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
log(`blockCount`, numBlocksPerCharacter)
