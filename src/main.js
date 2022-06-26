// @ts-check

// github 레포지토리 관리 CLI 만들기
const { Command } = require('commander')

const program = new Command()

console.log(process.argv)
program
  .name('string-util')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0')
