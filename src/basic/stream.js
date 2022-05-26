// @ts-check

const fs = require('fs')

// 대용량 데이터 처리에 특화된 노드 데이터 구조
// 데이터 파이프
const stream = fs.createReadStream('src/streamTest')

stream.pipe(process.stdout)
