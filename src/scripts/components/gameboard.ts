export default class GameBoard extends HTMLElement {
  word: string
  wordLeters: string[]
  currentRow: number = 0
  currentCol: number = 0
  currentRowValue: string = ''
  rows: { el: HTMLDivElement, cols: HTMLDivElement[] }[] = []
  
  constructor(word: string) {
    super()

    this.word = word.toLowerCase()
    this.wordLeters = this.word.split('')
    
    document.addEventListener('keyup', (e) => this.onKeyPress(e))
    this.render()
  }

  row(count: number) {
    const row = document.createElement('div')

    row.id = `row-${count}`
    row.setAttribute('class', `flex gap-1 w-full`)

    this.rows.push({ el: row, cols: [] })

    for (let colIndex = 0; colIndex < this.word.length; colIndex++) {
      const col = document.createElement('div')

      col.id = `row-${count}-${colIndex}`
      col.setAttribute('style', 'height: 100%; position: relative; width: 100%; min-height: 5vh;')
      col.setAttribute('class', 'w-full h-full inline-flex justify-center items-center border-2 border-neutral-300 dark:text-white dark:border-neutral-700 uppercase')
      
      row.appendChild(col)

      this.rows[count].cols.push(col)
    }

    return row
  }

  render() {
    this.id = 'gameboard'
    this.setAttribute('class', 'grid grid-rows-12 relative gap-1 p-1 box-border w-full h-full max-w-[350px] max-h-[420px]')

    for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
      this.appendChild(this.row(rowIndex))
    }
  }

  onKeyPress(e: KeyboardEvent) {
    e.preventDefault()

    if (e.code.match(/Key[A-Z]/g)) return this.addLetter(e.key)
    if (e.code === 'Backspace') return this.erase()
    if (
      e.code === 'Enter' &&
      this.currentRowValue.length === this.word.length
    ) return this.send()
  }

  onKeyBtnPress(key: string) {
    if (key === 'backspace') return this.erase()
    if (key === 'send') return this.send()
    if (key.match(/[a-zA-Z]/g)) return this.addLetter(key)
  }

  addLetter(letter: string) {
    if (this.currentCol >= this.word.length) return
      const col = this.rows[this.currentRow].cols[this.currentCol]

      col!.innerHTML = letter

      this.currentCol += 1
      this.currentRowValue += letter.toLowerCase()
  }

  erase() {
    if (this.currentCol > 0) this.currentCol -= 1

    const col = this.rows[this.currentRow].cols[this.currentCol]

    col!.innerText = ''
    this.currentRowValue = this.currentRowValue.slice(0, -1)
  }

  send() {
    this.validateInput(this.currentRowValue, this.currentRow)

    if (this.currentRow === 6) return
    
    this.currentRow += 1
    this.currentCol = 0
    this.currentRowValue = ''
  }

  validateInput(value: string, row: number) {
    if (this.word === value) {
      for (let colIndex = 0; colIndex < this.word.length; colIndex++) {
        const col = document.getElementById(`row-${row}-${colIndex}`)

        col?.classList.add('bg-green-600')
      }

      this.endGame(true, row)

      return
    } else if (row >= 5) {
      this.endGame(false, row)
    }
    
    for (let valueIndex = 0; valueIndex < value.length; valueIndex++) {
      const val = value[valueIndex]
      const col = this.rows[row].cols[valueIndex]
      const sameLetter = value.split('')
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => item === val)
          .sort((a, b) => a.index - b.index)
      const wordSameLetter = this.wordLeters
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item === val)
      
      if (
        this.word.includes(val) &&
        wordSameLetter.findIndex(({ index }) => index === valueIndex) > -1
      ) {
        col.classList.add('bg-green-500')
      } else if (this.word.includes(val)) {
        if (
          wordSameLetter.length < sameLetter.length &&
          sameLetter[wordSameLetter.length - 1].index !== valueIndex
        ) return
        
        
        col?.classList.add('bg-amber-500')
      } else if (!this.word.includes(val)) {
        this.dispatchEvent(new CustomEvent('wrongKey', { detail: val }))
      }
    }
  }

  endGame(win: boolean, intents: number) {
    this.dispatchEvent(
      new CustomEvent('end', {
        detail: { win, intents: intents + 1 }
      })
    )
  }
}

customElements.define('wordle-table', GameBoard)
