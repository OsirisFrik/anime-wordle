import Key from './key'

export default class Keyboard extends HTMLElement {
  rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['send', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'backspace']
  ]
  
  constructor() {
    super()

    this.render()
  }

  row(count: number) {
    const row = document.createElement('div')

    row.setAttribute('class', 'flex gap-1 pt-2')

    for (const key of this.rows[count]) {
      const keyBtn = new Key(key)

      // @ts-ignore
      keyBtn.addEventListener('keyClick', (e: CustomEvent) => {
        console.log('keyClick', e)
        this.dispatchEvent(new CustomEvent('keyPress', { detail: e.detail }))
      })

      row.appendChild(keyBtn)
    }

    return row
  }

  render() {
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      this.appendChild(this.row(rowIndex))
    }
  }
}

customElements.define('keyboard-game', Keyboard)
