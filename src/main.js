// @ts-check

// github 레포지토리 관리 CLI 만들기
// 환경변수 이용하지 않고 .env 파일에 넣어 관리 가능
require('dotenv').config()

// const { GITHUB_ACCESS_TOKEN } = process.env
const { Command } = require('commander')

const program = new Command()

console.log(process.argv)
program
  .name('string-util')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0')

program.parse()
