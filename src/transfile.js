// obtional chaining와 같은 새로운 문법
function sleep(duration) {
  return new Promise((resolve) => {
    console.log('sleep start')
    setTimeout(() => {
      console.log('sleep done', duration)
      resolve(null)
    }, duration)
  })
}

// sleep(1000)
// sleep(2000)
// sleep(3000)
// console.log('Promise all done!')
sleep(1000)
  .then((value) => sleep(1000))
  .then((value) => sleep(1000))
  .then((value) => sleep(1000))

// Promise.all([sleep(1000), sleep(2000), sleep(3000)]).then(() => {
//   console.log('Promise all done!')
// })
