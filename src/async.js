// 비동기 = 비기다림
// Callback style: cb(cb(cb(...)))
// Promise style: resolve, reject ->then으로 연결 *promise객체 부분은 fs.promises.readFile('fileName')처럼 만들어진 method 있음
// Async style: await function: await뒤에 있는 function을 기다려라!
// await은 async function안에서만 사용 가능!
// promise를 return하는 function 앞에 await을 붙임
// error는 try, catch문 사용

/* function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined)
    }, duration)
  })
} */

async function sleep(duration) {
  setTimeout(() => {
    console.log(undefined)
  }, duration)
}

async function main() {
  console.log('first')
  await sleep(2000)
  console.log('second')
  await sleep(2000)
  console.log('third')
  await sleep(2000)
  console.log('finish!')
}

main()
