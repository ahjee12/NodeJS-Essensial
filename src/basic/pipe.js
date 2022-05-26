// @ts-check
// const { log, error } = console
const { log } = console

const fs = require('fs')
const stream = require('stream')
const zlib = require('zlib')
const util = require('util')

async function gzip() {
  log(`gzip !!!`)
  return util.promisify(stream.pipeline)(
    fs.createReadStream('src/local/big-file'),
    zlib.createGzip(),
    fs.createWriteStream('src/local/big-file.gz')
  )
}

async function gunzip() {
  log(`gunzip !!!`)
  return util.promisify(stream.pipeline)(
    fs.createReadStream('src/local/big-file.gz'),
    zlib.createGunzip(),
    fs.createWriteStream('src/local/big-file.unzipped')
  )
}

async function main() {
  await gzip()
  await gunzip()
}

main()

/*
stream.pipeline(
  fs.createReadStream('src/local/big-file'),
  zlib.createGzip(),
  fs.createWriteStream('src/local/big-file.gz'),
  (err) => {
    if (err) {
      error(`Pipeline failed`, err)
    } else {
      log(`Pipeline succeeded`)
  
      stream.pipeline(
        fs.createReadStream('src/local/big-file.gz'),
        zlib.createGunzip(),
        fs.createWriteStream('src/local/big-file.unzipped'),
        (_err) => {
          if (_err) {
            error(`Gunzip failed`, _err)
          } else {
            log(`Gunzip succeeded`)
          }
        }
      )
    }
  }
)
*/
