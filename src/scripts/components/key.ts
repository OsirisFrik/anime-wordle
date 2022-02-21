export default class Key extends HTMLElement {
  key: string
  
  constructor(key: string) {
    super()

    this.key = key
    this.addEventListener('click', (e) => this.onClick(e))
    this.id = `key-${key}`
    this.render()
  }

  onClick(e: MouseEvent) {
    e.preventDefault()

    this.dispatchEvent(new CustomEvent('keyClick', { detail: this.key }))
  }

  render() {
    this.setAttribute('class', 'flex-1 rounded uppercase font-bold p-1 pt-4 sm:p-2 h-14 text-sm bg-gray-300 text-center')
    
    if (this.key === 'backspace') {
      const icon = document.createElement('i')

      icon.classList.add('class', 'ri-delete-back-2-line')

      this.appendChild(icon)
    } else {
      this.innerText = this.key
    }
  }
}

customElements.define('key-btn', Key)
