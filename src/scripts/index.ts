import GameBoard from './components/gameboard'
import Keyboard from './components/keyboard'

// css
import 'remixicon/fonts/remixicon.css'

let main: HTMLElement
let keyboardContainer: HTMLDivElement
let modal: HTMLDivElement
let howToPlay: HTMLButtonElement
let close: HTMLButtonElement

function init() {
  main = document.getElementById('main') as HTMLElement
  keyboardContainer = document.getElementById('keyboardContainer') as HTMLDivElement
  modal = document.getElementById('modal') as HTMLDivElement
  howToPlay = document.getElementById('howToPlay') as HTMLButtonElement
  close = document.getElementById('close') as HTMLButtonElement

  const gameboard = new GameBoard('kirito')
  const keyboard = new Keyboard()

  main.appendChild(gameboard)
  keyboardContainer.appendChild(keyboard)

  // @ts-ignore
  keyboard.addEventListener('keyPress', (e: CustomEvent) => {
    gameboard.onKeyBtnPress(e.detail)
  })

  howToPlay.addEventListener('click', () => {
    modal.firstElementChild?.classList.remove('hidden')
  })

  close.addEventListener('click', () => {
    modal.firstElementChild?.classList.add('hidden')
  })
}

window.onload = init
