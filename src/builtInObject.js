// @ts-check

console.log('_dirname', __dirname)
console.log('_filename', __filename)

// 표준입출력 stream
process.stdin.setEncoding('utf-8')
process.stdin.on('data', (data) => {
  console.log(data, data.length)
})

process.stdin.pipe(process.stdout)
