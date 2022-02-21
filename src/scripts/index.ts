import { v4 as uuid } from 'uuid'
import GameBoard from './components/gameboard'
import Keyboard from './components/keyboard'
import animes, { AnimeDatails } from './animes'
import { getCharacters, Character } from './api/jikan'

// css
import 'remixicon/fonts/remixicon.css'
import { LogEvent, setUser } from './firebase'

const main = document.getElementById('main') as HTMLElement
const keyboardContainer = document.getElementById('keyboardContainer') as HTMLDivElement
const modal = document.getElementById('modal') as HTMLDivElement
const howToPlay = document.getElementById('howToPlay') as HTMLButtonElement
const close = document.getElementById('close') as HTMLButtonElement
const animeName = document.getElementById('animeName') as HTMLElement
const answer = document.getElementById('answer') as HTMLDivElement
const resetBtn = document.getElementById('reset') as HTMLButtonElement
let currentAnime: AnimeDatails
let gameboard: GameBoard
let keyboard: Keyboard

window.onload = async function init() {
  howToPlay.addEventListener('click', () => {
    modal.firstElementChild?.classList.remove('hidden')
  })

  close.addEventListener('click', () => {
    modal.firstElementChild?.classList.add('hidden')
  })

  resetBtn.addEventListener('click', (e: MouseEvent) => {
    loadGame()
    LogEvent('restart')

    if (!answer.classList.contains('hidden')) {
      answer.classList.add('hidden')
    }
  })
  
  loadGame()

  if (!localStorage.getItem('firstPlay')) {
    modal.firstElementChild?.classList.remove('hidden')
    localStorage.setItem('firstPlay', 'true')
    LogEvent('firstPlay')
  }

  let uid = localStorage.getItem('uid')

  if (!uid) {
    uid = uuid()

    localStorage.setItem('uid', uid)
  }

  await setUser(uid)
  LogEvent('init')
}

function setAnimeName(name: string) {
  animeName.innerText = name
}

function randomIndex(limit: number) {
  return Math.floor(Math.random() * limit)
}

async function getCharacterName(animeCharacters: Character[]): Promise<string> {
  const { character } = animeCharacters[randomIndex(animeCharacters.length)]
  const characterName = character.name.includes(',') ?
    character.name.split(', ')[randomIndex(character.name.split(', ').length)] : character.name.includes(' ') ?
      character.name.split(' ')[randomIndex(character.name.split(' ').length)] : character.name

  if (characterName!.length > 10) return getCharacterName(animeCharacters)

  return characterName as string
}

async function loadGame() {
  LogEvent('loadGame')
  currentAnime = animes[randomIndex(animes.length)]

  setAnimeName(currentAnime.name)

  const animeCharacters = await getCharacters(currentAnime.id)
  const name = await getCharacterName(animeCharacters)

  console.log(name)

  gameboard = new GameBoard(name)
  keyboard = new Keyboard()
  
  // @ts-ignore
  keyboard.addEventListener('keyPress', (e: CustomEvent) => {
    gameboard.onKeyBtnPress(e.detail)
  })

  // @ts-ignore
  gameboard.addEventListener('end', (e: CustomEvent) => {
    answer.firstElementChild!.innerHTML = gameboard.word.toUpperCase()
    if (e.detail.win) {
      answer.firstElementChild!.innerHTML += ' 🎉'
    } else {
      answer.firstElementChild!.innerHTML += ' 😨'
    }

    answer.classList.remove('hidden')
    LogEvent('endGame', e.detail)
  })

  // @ts-ignore
  gameboard.addEventListener('wrongKey', (e: CustomEvent) => {
    keyboard.disableKey(e.detail)
  })

  main.replaceChildren(gameboard)
  keyboardContainer.replaceChildren(keyboard)
}
