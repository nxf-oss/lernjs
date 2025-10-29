import { DOM } from './dom'
import { StyleInjector } from './styles'
import { FloatingAnimation, ParticleSystem, TypewriterEffect, RippleEffect } from './animations'

class NotFoundPage {
  private floatingAnimation: FloatingAnimation
  private particleSystem: ParticleSystem
  private typewriterEffect: TypewriterEffect
  private rippleEffect: RippleEffect

  constructor() {
    this.floatingAnimation = new FloatingAnimation()
    this.particleSystem = new ParticleSystem(document.body)
    this.typewriterEffect = new TypewriterEffect(
      DOM.createElement('span', 'typewriter-text'),
      [
        'Halaman yang kamu cari tidak ditemukan...',
        'Sepertinya tersesat di alam digital?',
        'Mungkin sedang berlibur ke dimensi lain?',
        'Ayo kita kembali ke jalan yang benar!',
        'Setiap developer pernah mengalami ini!',
        'Jangan menyerah - mari explore lagi!',
      ] as const,
      80,
      40,
      2000
    )
    this.rippleEffect = new RippleEffect(document.body)
  }

  initialize(): void {
    StyleInjector.inject()
    this.render()
    this.setupEventListeners()
    this.startAnimations()

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-mode')
    }
  }

  private render(): void {
    const container = DOM.createElement('div', 'container')

    const themeToggle = DOM.createElement('button', 'theme-toggle', {
      'aria-label': 'Toggle dark mode',
    })
    themeToggle.innerHTML = '🌙'
    document.body.appendChild(themeToggle)

    const particlesContainer = DOM.createElement('div', 'particles-container')
    document.body.appendChild(particlesContainer)

    const content = DOM.createElement('div', 'error-content')

    const errorCode = DOM.createElement('div', 'error-code')
    errorCode.textContent = '404'
    content.appendChild(errorCode)

    const errorTitle = DOM.createElement('h1', 'error-title')
    errorTitle.textContent = 'Oops! Halaman Tidak Ditemukan'
    content.appendChild(errorTitle)

    const errorDescription = DOM.createElement('p', 'error-description')
    errorDescription.textContent =
      'Sepertinya halaman yang kamu cari telah menghilang ke dalam lubang hitam digital atau sedang berpetualang di alam semesta paralel. Jangan khawatir, kita bisa menemukan jalan kembali bersama!'
    content.appendChild(errorDescription)

    const typewriterContainer = DOM.createElement('div', 'typewriter-container')
    const typewriterElement = DOM.createElement('span', 'typewriter-text')
    typewriterContainer.appendChild(typewriterElement)
    content.appendChild(typewriterContainer)

    const illustrationContainer = DOM.createElement('div', 'illustration-container')
    const illustration = DOM.createElement('div', 'floating-illustration')
    illustration.innerHTML = this.createSpaceIllustration()
    illustrationContainer.appendChild(illustration)
    content.appendChild(illustrationContainer)

    const actionsGrid = DOM.createElement('div', 'actions-grid')

    const actions = [
      {
        icon: '🚀',
        title: 'Kembali ke Home',
        description: 'Mulai petualangan dari awal dengan panduan yang benar',
        href: '/',
      },
      {
        icon: '🔍',
        title: 'Jelajahi Dokumentasi',
        description: 'Temukan solusi dan panduan lengkap di dokumentasi kami',
        href: '/docs',
      },
      {
        icon: '💫',
        title: 'Lihat Contoh',
        description: 'Pelajari dari contoh-contoh kode dan implementasi',
        href: '/examples',
      },
      {
        icon: '⭐',
        title: 'GitHub Repository',
        description: 'Kontribusi atau eksplorasi kode sumber di GitHub',
        href: 'https://github.com/nxf-oss/lernjs',
      },
    ] as const

    for (const action of actions) {
      const card = DOM.createElement('a', 'action-card', {
        href: action.href,
      })

      const icon = DOM.createElement('div', 'action-icon')
      icon.textContent = action.icon

      const title = DOM.createElement('h3', 'action-title')
      title.textContent = action.title

      const description = DOM.createElement('p', 'action-description')
      description.textContent = action.description

      card.appendChild(icon)
      card.appendChild(title)
      card.appendChild(description)
      actionsGrid.appendChild(card)
    }

    content.appendChild(actionsGrid)

    const footerNote = DOM.createElement('p', 'footer-note')
    footerNote.textContent =
      'Setiap jalan yang salah adalah pelajaran baru menuju solusi yang tepat. Terus eksplorasi!'
    content.appendChild(footerNote)

    container.appendChild(content)
    document.body.appendChild(container)

    this.floatingAnimation.addElement(errorCode)
    this.floatingAnimation.addElement(illustration)
    this.typewriterEffect = new TypewriterEffect(typewriterElement, [
      'Halaman yang kamu cari tidak ditemukan...',
      'Sepertinya tersesat di alam digital?',
      'Mungkin sedang berlibur ke dimensi lain?',
      'Ayo kita kembali ke jalan yang benar!',
      'Setiap developer pernah mengalami ini!',
      'Jangan menyerah - mari explore lagi!',
    ] as const)
  }

  private setupEventListeners(): void {
    const themeToggle = document.querySelector('.theme-toggle') as HTMLElement

    themeToggle?.addEventListener('click', event => {
      event.stopPropagation()
      document.body.classList.toggle('dark-mode')
      const isDark = document.body.classList.contains('dark-mode')
      themeToggle.innerHTML = isDark ? '☀️' : '🌙'
      this.rippleEffect.createRipple((event as MouseEvent).clientX, (event as MouseEvent).clientY)
    })

    document.addEventListener('click', event => {
      this.rippleEffect.createRipple(event.clientX, event.clientY)
    })

    const animatedElements = document.querySelectorAll(
      '.action-card, .error-code, .floating-illustration'
    )
    for (const element of animatedElements) {
      DOM.onVisible(element as HTMLElement, () => {
        element.classList.add('animate-in')
      })
    }
  }

  private startAnimations(): void {
    this.floatingAnimation.start()
    this.particleSystem.start()
    this.typewriterEffect.start()
  }

  private createSpaceIllustration(): string {
    return `
      <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="spaceBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f0c29"/>
            <stop offset="50%" stop-color="#302b63"/>
            <stop offset="100%" stop-color="#24243e"/>
          </linearGradient>
          <radialGradient id="planetGradient">
            <stop offset="0%" stop-color="#ff9a9e"/>
            <stop offset="100%" stop-color="#fecfef"/>
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="glow"/>
            <feComposite in="SourceGraphic" in2="glow" operator="over"/>
          </filter>
        </defs>

        <rect width="600" height="400" fill="url(#spaceBg)"/>

        <g fill="#ffffff" opacity="0.9">
          ${Array.from({ length: 80 }, () => {
            const x = Math.random() * 600
            const y = Math.random() * 400
            const size = Math.random() * 1.2 + 0.3
            const opacity = Math.random() * 0.8 + 0.2
            return `<circle cx="${x}" cy="${y}" r="${size}" opacity="${opacity}"/>`
          }).join('')}
        </g>

        <circle cx="450" cy="100" r="40" fill="url(#planetGradient)" filter="url(#glow)"/>
        <circle cx="450" cy="100" r="35" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.3"/>

        <g transform="translate(150, 200)" filter="url(#glow)">
          <path d="M -60 -80 L -40 -60 L -20 -80 L 0 -60 L 20 -80 L 40 -60 L 60 -80 L 60 60 L -60 60 Z"
                fill="#e2e8f0" stroke="#cbd5e0" stroke-width="2"/>
          <rect x="-50" y="-70" width="100" height="20" rx="3" fill="#4a5568"/>
          <circle cx="-30" y="-30" r="8" fill="#4a5568"/>
          <circle cx="0" y="-30" r="8" fill="#4a5568"/>
          <circle cx="30" y="-30" r="8" fill="#4a5568"/>
          <rect x="-20" y="10" width="40" height="30" rx="2" fill="#4a5568"/>
          <path d="M -40 40 L -60 60 M 40 40 L 60 60" stroke="#4a5568" stroke-width="3"/>
        </g>

        <g transform="translate(300, 300)">
          <circle cx="0" cy="0" r="25" fill="#ffd700" filter="url(#glow)"/>
          <g transform="rotate(45)">
            ${Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 45 * Math.PI) / 180
              const length = 35
              const x2 = Math.cos(angle) * length
              const y2 = Math.sin(angle) * length
              return `<line x1="0" y1="0" x2="${x2}" y2="${y2}" stroke="#ffd700" stroke-width="2" opacity="0.7"/>`
            }).join('')}
          </g>
        </g>

        <text x="300" y="380" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="18" font-weight="bold" opacity="0.8">
          🚀 Lost in Space • 404 Not Found 🌌
        </text>
      </svg>
    `
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new NotFoundPage().initialize()
  })
} else {
  new NotFoundPage().initialize()
}
