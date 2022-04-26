// @ts-check

// const fs = require('fs')

// const result = fs.readFileSync('src/bufferTest')

// const buffer = Buffer.from([97, 98, 99, 100, 100])

// const bufferA = Buffer.from([0])
// const bufferB = Buffer.from([3])
// const bufferC = Buffer.from([2])
// const bufferD = Buffer.from([6])

// console.log(buffer)
// console.log(result)
// console.log(buffer.compare(result))

// const bufs = [bufferA, bufferB, bufferC, bufferD]
// bufs.sort(Buffer.compare)
// // /bufs.sort((a, b) => a.compare(b))
// console.log(bufs)

// 한자리당 8bit 총 4byte -> 정수로 나타냄
const buf = Buffer.from([0, 0, 0, 1, 0])

// LE: Little Endian 앞이 가장 작음
// BE: Big Endian
// console.log(buf.readInt32LE(1))

/**
 * @param {*} array
 * @returns {number}
 */

function readInt32LE(array) {
  return array[0] + array[1] * 256 + array[2] * 256 ** 2 + array[3] * 256 ** 3
}

/**
 * @param {*} array
 * @returns {number}
 */

function readInt32BE(array) {
  return array[3] + array[2] * 256 + array[1] * 256 ** 2 + array[0] * 256 ** 3
}

const { log } = console

log(`our function: `, readInt32LE(buf))
log(`orig function: `, buf.readInt32LE(0))
log(`our function: `, readInt32BE(buf))
log(`orig function: `, buf.readInt32BE(0))
