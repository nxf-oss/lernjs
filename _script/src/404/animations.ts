import { DOM } from './dom'
export class FloatingAnimation {
  private elements: HTMLElement[] = []
  private isRunning = false
  private animationId: number | null = null
  constructor(
    private amplitude: number = 12,
    private speed: number = 1.8,
    private rotationIntensity: number = 2
  ) {}
  addElement(element: HTMLElement): void {
    if (!this.elements.includes(element)) {
      this.elements.push(element)
    }
  }
  removeElement(element: HTMLElement): void {
    const index = this.elements.indexOf(element)
    if (index > -1) {
      this.elements.splice(index, 1)
    }
  }
  start(): void {
    if (this.isRunning) return
    this.isRunning = true
    this.animate()
  }
  stop(): void {
    this.isRunning = false
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.elements.forEach(element => {
      DOM.setStyles(element, {
        transform: 'translateY(0px) rotate(0deg)',
      })
    })
  }
  private animate(): void {
    if (!this.isRunning) return
    const time = performance.now() * 0.001
    this.elements.forEach((element, index) => {
      try {
        const offset = (index * Math.PI * 2) / this.elements.length
        const y = Math.sin(time * this.speed + offset) * this.amplitude
        const x = Math.cos(time * this.speed * 0.7 + offset) * (this.amplitude * 0.3)
        const rotation = Math.sin(time * 0.5 + offset) * this.rotationIntensity
        DOM.setStyles(element, {
          transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`,
          transition: 'transform 0.1s linear',
        })
      } catch (error) {
        console.warn('Error animating element:', error)
      }
    })
    this.animationId = requestAnimationFrame(() => this.animate())
  }
  destroy(): void {
    this.stop()
    this.elements = []
  }
}
export class ParticleSystem {
  private particles: HTMLDivElement[] = []
  private isRunning = false
  private timeoutId: number | null = null
  private readonly particleShapes = ['circle', 'square', 'triangle'] as const
  constructor(private container: HTMLElement) {}
  start(): void {
    if (this.isRunning) return
    this.isRunning = true
    this.createParticles()
  }
  stop(): void {
    this.isRunning = false
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.particles.forEach(particle => {
      particle.style.animationPlayState = 'paused'
      particle.remove()
    })
    this.particles = []
  }
  private createParticles(): void {
    if (!this.isRunning) return
    const particleCount = Math.floor(Math.random() * 2) + 3
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        if (this.isRunning) this.createParticle()
      }, i * 200)
    }
    this.timeoutId = window.setTimeout(() => {
      this.createParticles()
    }, 1800 + Math.random() * 500)
  }
  private createParticle(): void {
    try {
      const particle = DOM.createElement('div', 'particle', {
        'aria-hidden': 'true',
      })
      const size = Math.random() * 6 + 2
      const startX = Math.random() * 100
      const duration = Math.random() * 3 + 2
      const delay = Math.random() * 1
      const shape = this.particleShapes[Math.floor(Math.random() * this.particleShapes.length)]
      DOM.setStyles(particle, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${startX}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        opacity: '0.7',
      })
      switch (shape) {
        case 'square':
          DOM.setStyles(particle, {
            borderRadius: '2px',
            background: 'currentColor',
          })
          break
        case 'triangle':
          DOM.setStyles(particle, {
            width: '0px',
            height: '0px',
            background: 'transparent',
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid currentColor`,
          })
          break
        case 'circle':
        default:
          DOM.setStyles(particle, {
            borderRadius: '50%',
            background: 'currentColor',
          })
      }
      this.container.appendChild(particle)
      this.particles.push(particle)
      const removeTime = (duration + delay) * 1000
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove()
        }
        this.particles = this.particles.filter(p => p !== particle)
      }, removeTime)
    } catch (error) {
      console.error('Error creating particle:', error)
    }
  }
  destroy(): void {
    this.stop()
  }
}
export class TypewriterEffect {
  private currentText = ''
  private currentIndex = 0
  private isDeleting = false
  private isPaused = false
  private timeoutId: number | null = null
  private readonly cursorChar = '▊'
  constructor(
    private element: HTMLElement,
    private texts: readonly string[],
    private typingSpeed: number = 85,
    private deletingSpeed: number = 45,
    private pauseTime: number = 1800,
    private startDelay: number = 500
  ) {}
  start(): void {
    if (!this.element || !Array.isArray(this.texts) || this.texts.length === 0) {
      console.warn('TypewriterEffect: Invalid element or texts')
      return
    }
    this.isPaused = false
    setTimeout(() => {
      if (!this.isPaused) this.type()
    }, this.startDelay)
  }
  stop(): void {
    this.isPaused = true
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
  pause(): void {
    this.isPaused = true
  }
  resume(): void {
    if (this.isPaused) {
      this.isPaused = false
      this.type()
    }
  }
  private type(): void {
    if (this.isPaused) return
    const currentText = this.texts[this.currentIndex]
    if (!currentText) {
      console.warn('TypewriterEffect: No text available at index', this.currentIndex)
      return
    }
    const shouldType = !this.isDeleting && this.currentText.length < currentText.length
    const shouldDelete = this.isDeleting && this.currentText.length > 0
    const shouldSwitch = this.isDeleting && this.currentText.length === 0
    if (shouldType) {
      this.currentText = currentText.substring(0, this.currentText.length + 1)
    } else if (shouldDelete) {
      this.currentText = currentText.substring(0, this.currentText.length - 1)
    } else if (shouldSwitch) {
      this.isDeleting = false
      this.currentIndex = (this.currentIndex + 1) % this.texts.length
      this.timeoutId = window.setTimeout(() => this.type(), 400)
      return
    } else {
      this.isDeleting = true
      this.timeoutId = window.setTimeout(() => this.type(), this.pauseTime)
      return
    }
    this.element.textContent = this.currentText + this.cursorChar
    const speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed
    const variedSpeed = speed + (Math.random() * 20 - 10)
    this.timeoutId = window.setTimeout(() => this.type(), Math.max(variedSpeed, 30))
  }
  destroy(): void {
    this.stop()
    this.element.textContent = ''
  }
}
export class RippleEffect {
  private readonly rippleClass = 'ripple'
  private readonly rippleDuration = 600
  constructor(private container: HTMLElement) {}
  createRipple(x: number, y: number, color: string = 'rgba(255, 255, 255, 0.6)'): void {
    try {
      const ripple = DOM.createElement('div', this.rippleClass)
      const size = Math.max(this.container.offsetWidth, this.container.offsetHeight) * 0.1
      DOM.setStyles(ripple, {
        position: 'absolute',
        left: `${x - size / 2}px`,
        top: `${y - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: `ripple ${this.rippleDuration}ms linear`,
        pointerEvents: 'none',
        zIndex: '9999',
      })
      this.container.appendChild(ripple)
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.remove()
        }
      }, this.rippleDuration)
    } catch (error) {
      console.error('Error creating ripple:', error)
    }
  }
  attachToElement(element: HTMLElement, color?: string): void {
    element.addEventListener('click', (event: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      this.createRipple(x, y, color)
    })
  }
  destroy(): void {
    const ripples = this.container.querySelectorAll(`.${this.rippleClass}`)
    ripples.forEach(ripple => ripple.remove())
  }
}
const rippleStyles = `
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
`
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = rippleStyles
  document.head.appendChild(style)
}
