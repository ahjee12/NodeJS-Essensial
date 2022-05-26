// @ts-check
const { log } = console
const fs = require('fs')

/**
 * @param {number} highWaterMark
 */

function processJSON(highWaterMark) {
  const rs = fs.createReadStream('src/local/jsons', {
    encoding: 'utf-8',
    highWaterMark,
  })

  let totalSum = 0
  let accumulatedJsonStr = ''

  rs.on('data', (chunk) => {
    // log(`-------------------------------------------`)
    log(`Event: chunk -`, chunk)

    if (typeof chunk !== 'string') {
      return
    }
    accumulatedJsonStr += chunk

    // indexOf 안되는 이유:
    // 1. 두번째 loop이후에는 0번째에 줄바꿈 있음
    // 2. 쪼개진 데이터 개수 (loop 횟수)만큼만 더해짐
    /* {"data": 4}
       \n{"data": 63}
       \n{"data": 22}
       \n{"data":}
       \n{"data": 34}
     */
    const lastNewlineIndx = accumulatedJsonStr.lastIndexOf('\n')
    log(`lastNewlineIndx`, lastNewlineIndx)
    const jsonLinesStr = accumulatedJsonStr.substring(0, lastNewlineIndx)
    accumulatedJsonStr = accumulatedJsonStr.substring(lastNewlineIndx)
    // parse object
    // filter로 undefined 걸러냄

    totalSum += jsonLinesStr
      .split('\n')
      .map((jsonLine) => {
        try {
          return JSON.parse(jsonLine)
        } catch {
          return undefined
        }
      })
      .filter((json) => json)
      .map((json) => json.data)
      .reduce((sum, curr) => sum + curr, 0)
  })
  log(`-------------------------------------------`)

  rs.on('end', () => {
    log(`-------------------------------------------`)
    log(`Event: end`)
    log(`totalSum (hightWatermark: ${highWaterMark})`, totalSum)
  })
}

for (let i = 30; i >= 29; i -= 1) {
  processJSON(i)
}
