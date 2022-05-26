// 비동기적으로 집 청소하기
const meAsync = {
  laundry: () =>
    new Promise((resolve) => {
      // setInterval => 비동기적으로 수행하는 코드
      console.log('세탁기 돌리기 시작')
      let percentage = 25

      const intervalId = setInterval(() => {
        console.log(`${percentage}% 완료`)
        percentage += 25

        if (percentage === 125) {
          clearInterval(intervalId)
          resolve()
        }
      }, 2000)
    }),
  dishes: () => console.log('설거지 하기'),
  toilet: () => console.log('화장실 청소 하기'),
}

// const doWorkAsync = () => {
//   meAsync.laundry()
//   meAsync.dishes()
//   meAsync.toilet()
// }

// doWorkAsync()
const doWorkAsync = async () => {
  await meAsync.laundry()
  meAsync.dishes()
  meAsync.toilet()
}

doWorkAsync()
