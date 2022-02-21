export default class Key extends HTMLElement {
  key: string
  disabled = false
  
  constructor(key: string) {
    super()

    this.key = key
    this.addEventListener('click', (e) => this.onClick(e))
    this.id = `key-${key}`
    this.render()
  }

  onClick(e: MouseEvent) {
    e.preventDefault()

    if (this.disabled) return

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

  disable() {
    this.disabled = true
    this.classList.add('disable', 'bg-stone-800')
  }
}

customElements.define('key-btn', Key)
