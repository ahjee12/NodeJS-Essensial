// @ts-check

// IIFE socket 노출 방지
;(() => {
  // @ts-ignore
  const socket = new WebSocket(`ws://${window.location.host}/ws`)
  // @ts-ignore
  const formEl = document.getElementById('form')
  // @ts-ignore
  const chatsEl = document.getElementById('chats')
  /** @type {HTMLInputElement | null} */
  // @ts-ignore
  const inputEl = document.getElementById('input')

  if (!formEl || !inputEl || !chatsEl) {
    throw new Error('Init failed!!')
  }

  /**
   * @typedef Chat
   * @property {string} nickname
   * @property {string} message
   */
  /**
   * @type {Chat[]}
   */
  const chats = []

  const adjectives = ['멋진', '훌륭한', '친절한', '훔흄한', '밍밍한']
  const animals = ['물범', '사자', '고래', '새', '강아지', '고양이']

  /**
   * @param {string[]} array
   * @returns {string}
   */
  function pickRandom(array) {
    const randomIdx = Math.floor(Math.random() * array.length)
    const result = array[randomIdx]
    if (!result) {
      throw new Error('array length is 0')
    }
    return result
  }
  const myNickname = `${pickRandom(adjectives)} ${pickRandom(animals)}`
  // @ts-ignore
  formEl.addEventListener('submit', (event) => {
    event.preventDefault()
    /*
    const nickFront = pickRandom(adjectives)
    const nickBack = pickRandom(animals)
    const myNickname = `${nickFront} ${nickBack}`
    */
    // server에 전달할 때는 stringify
    // @ts-ignore

    socket.send(
      JSON.stringify({
        nickname: myNickname,
        message: inputEl.value,
      })
    )

    inputEl.value = ''
  })

  /*
  socket.addEventListener('open', () => {
    const message = 'Hello, Server!!'
    socket.send(message)
  })
  */

  const drawChats = () => {
    chatsEl.innerHTML = ''
    chats.forEach(({ message, nickname }) => {
      // @ts-ignore
      const div = document.createElement('div')
      div.innerText = `${nickname}: ${message}`
      chatsEl.appendChild(div)
    })
  }

  // @ts-ignore
  socket.addEventListener('message', (event) => {
    const { type, payload } = JSON.parse(event.data)

    if (type === 'sync') {
      const { chats: syncedChats } = payload
      chats.push(...syncedChats)
    } else if (type === 'chat') {
      const chat = payload
      chats.push(chat)
    }

    drawChats()
  })
})()
