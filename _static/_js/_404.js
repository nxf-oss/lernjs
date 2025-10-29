var a = class {
  static createElement(e, t, i = {}) {
    let r = document.createElement(e)
    t && this.addClasses(r, t)
    for (let [n, o] of Object.entries(i)) r.setAttribute(n, o)
    return r
  }
  static addClasses(e, t) {
    if (typeof t == 'string') e.classList.add(t)
    else if (Array.isArray(t)) e.classList.add(...t)
    else for (let [i, r] of Object.entries(t)) r && e.classList.add(i)
  }
  static setStyles(e, t) {
    for (let [i, r] of Object.entries(t)) e.style[i] = r
  }
  static waitFor(e) {
    return new Promise(t => setTimeout(t, e))
  }
  static onVisible(e, t) {
    let i = new IntersectionObserver(r => {
      for (let n of r) n.isIntersecting && (t(), i.unobserve(e))
    })
    i.observe(e)
  }
}
var m = class {
  static injected = !1
  static inject() {
    if (this.injected) return
    let e = `
      :root {
        --white: #ffffff;
        --black: #000000;
        --gray-50: #f9fafb;
        --gray-100: #f3f4f6;
        --gray-200: #e5e7eb;
        --gray-300: #d1d5db;
        --gray-400: #9ca3af;
        --gray-500: #6b7280;
        --gray-600: #4b5563;
        --gray-700: #374151;
        --gray-800: #1f2937;
        --gray-900: #111827;
        --text-primary: var(--gray-900);
        --text-secondary: var(--gray-600);
        --text-tertiary: var(--gray-400);
        --bg-primary: var(--white);
        --bg-secondary: var(--gray-50);
        --bg-tertiary: var(--gray-100);
        --border: var(--gray-200);
        --accent: var(--gray-800);
        --accent-light: var(--gray-600);
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        --gradient-primary: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-300) 100%);
        --gradient-accent: linear-gradient(135deg, var(--gray-800) 0%, var(--black) 100%);
        --gradient-subtle: linear-gradient(135deg, var(--white) 0%, var(--gray-100) 100%);
      }
      .dark-mode {
        --text-primary: var(--white);
        --text-secondary: var(--gray-300);
        --text-tertiary: var(--gray-500);
        --bg-primary: var(--gray-900);
        --bg-secondary: var(--gray-800);
        --bg-tertiary: var(--gray-700);
        --border: var(--gray-600);
        --accent: var(--white);
        --accent-light: var(--gray-300);
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
        --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
        --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
        --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        --gradient-primary: linear-gradient(135deg, var(--gray-800) 0%, var(--gray-600) 100%);
        --gradient-accent: linear-gradient(135deg, var(--gray-300) 0%, var(--white) 100%);
        --gradient-subtle: linear-gradient(135deg, var(--gray-800) 0%, var(--gray-900) 100%);
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        background: var(--gradient-primary);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-primary);
        overflow-x: hidden;
        position: relative;
        line-height: 1.6;
        font-weight: 400;
      }
      .particles-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
      }
      .particle {
        position: absolute;
        border-radius: 50%;
        animation: float linear infinite;
        top: -20px;
        opacity: 0.6;
        background: var(--text-tertiary);
      }
      .particle.square {
        border-radius: 2px;
      }
      .particle.triangle {
        width: 0;
        height: 0;
        background: transparent;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 8px solid var(--text-tertiary);
        border-radius: 0;
      }
      @keyframes float {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0.6;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
      .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
        position: relative;
        z-index: 2;
      }
      .error-content {
        background: var(--bg-primary);
        border-radius: 24px;
        padding: 4rem 3rem;
        text-align: center;
        box-shadow: var(--shadow-xl);
        backdrop-filter: blur(10px);
        border: 1px solid var(--border);
        position: relative;
        overflow: hidden;
      }
      .error-content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--gradient-accent);
      }
      .error-code {
        font-size: 8rem;
        font-weight: 900;
        background: var(--gradient-accent);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 1rem;
        line-height: 1;
        letter-spacing: -0.02em;
        font-family: 'Inter', sans-serif;
      }
      .error-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        color: var(--text-primary);
        line-height: 1.2;
        letter-spacing: -0.01em;
      }
      .error-description {
        font-size: 1.25rem;
        color: var(--text-secondary);
        margin-bottom: 3rem;
        line-height: 1.7;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        font-weight: 400;
      }
      .typewriter-container {
        min-height: 3rem;
        margin-bottom: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .typewriter-text {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--accent);
        border-right: 2px solid var(--accent);
        padding-right: 6px;
        animation: blink 1s infinite;
        font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
      }
      @keyframes blink {
        0%, 50% { border-color: var(--accent); }
        51%, 100% { border-color: transparent; }
      }
      .illustration-container {
        margin: 3rem 0;
        position: relative;
      }
      .floating-illustration {
        max-width: 400px;
        margin: 0 auto;
        filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.1));
      }
      .book-illustration {
        width: 300px;
        height: 400px;
        background: var(--bg-secondary);
        border-radius: 16px;
        border: 2px solid var(--border);
        position: relative;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        margin: 0 auto;
      }
      .book-cover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--gradient-subtle);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        gap: 1rem;
      }
      .book-spine {
        position: absolute;
        left: -12px;
        top: 20px;
        width: 24px;
        height: 360px;
        background: var(--accent);
        border-radius: 6px 0 0 6px;
      }
      .book-title {
        font-size: 1.75rem;
        font-weight: 800;
        color: var(--text-primary);
        text-align: center;
      }
      .book-subtitle {
        font-size: 1rem;
        color: var(--text-secondary);
        text-align: center;
        font-weight: 500;
      }
      .page {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 270px;
        height: 370px;
        background: var(--bg-primary);
        border-radius: 6px;
        box-shadow: var(--shadow);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 2rem;
      }
      .page-line {
        height: 4px;
        background: var(--border);
        border-radius: 2px;
      }
      .page-line:nth-child(1) { width: 85%; }
      .page-line:nth-child(2) { width: 70%; }
      .page-line:nth-child(3) { width: 60%; }
      .page-line:nth-child(4) { width: 75%; }
      .page-line:nth-child(5) { width: 65%; }
      .page-line:nth-child(6) { width: 80%; }
      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }
      .action-card {
        background: var(--bg-secondary);
        padding: 2.5rem 2rem;
        border-radius: 16px;
        text-decoration: none;
        color: inherit;
        transition: all 0.3s ease;
        border: 1px solid var(--border);
        position: relative;
        overflow: hidden;
      }
      .action-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: var(--gradient-accent);
        opacity: 0.05;
        transition: left 0.3s ease;
      }
      .action-card:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
        border-color: var(--accent-light);
      }
      .action-card:hover::before {
        left: 0;
      }
      .action-icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
        display: block;
        opacity: 0.9;
      }
      .action-title {
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--text-primary);
        position: relative;
        z-index: 2;
      }
      .action-description {
        color: var(--text-secondary);
        line-height: 1.6;
        position: relative;
        z-index: 2;
        font-size: 1rem;
      }
      .floating-icon {
        position: absolute;
        font-size: 2.5rem;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        opacity: 0.9;
      }
      .icon-1 { top: -10px; right: 60px; }
      .icon-2 { bottom: 50px; left: 40px; }
      .icon-3 { top: 100px; right: 30px; }
      .theme-toggle {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 50%;
        width: 3.5rem;
        height: 3.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 1.3rem;
      }
      .theme-toggle:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-xl);
      }
      .footer-note {
        font-size: 1.1rem;
        color: var(--text-secondary);
        font-style: italic;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border);
        font-weight: 500;
      }
      .decoration-text {
        position: absolute;
        font-size: 7rem;
        font-weight: 900;
        color: var(--bg-tertiary);
        z-index: -1;
        user-select: none;
        white-space: nowrap;
        opacity: 0.4;
      }
      .decoration-1 {
        top: 10%;
        left: 5%;
        transform: rotate(-15deg);
      }
      .decoration-2 {
        bottom: 10%;
        right: 5%;
        transform: rotate(15deg);
      }
      @media (max-width: 1024px) {
        .error-code { font-size: 6rem; }
        .error-title { font-size: 2rem; }
        .error-content { padding: 3rem 2.5rem; }
        .book-illustration { width: 250px; height: 350px; }
        .decoration-text { font-size: 5rem; }
      }
      @media (max-width: 768px) {
        .error-code { font-size: 5rem; }
        .error-title { font-size: 1.75rem; }
        .error-description { font-size: 1.1rem; }
        .error-content { padding: 2.5rem 2rem; }
        .actions-grid { grid-template-columns: 1fr; gap: 1.25rem; }
        .theme-toggle { top: 1.5rem; right: 1.5rem; }
        .container { padding: 1.5rem; }
        .book-illustration { width: 220px; height: 300px; }
        .floating-icon { font-size: 2rem; }
        .decoration-text { font-size: 4rem; }
      }
      @media (max-width: 480px) {
        .error-code { font-size: 4rem; }
        .error-title { font-size: 1.5rem; }
        .error-description { font-size: 1rem; }
        .error-content { padding: 2rem 1.5rem; border-radius: 20px; }
        .action-card { padding: 2rem 1.5rem; }
        .typewriter-text { font-size: 1.2rem; }
        .book-illustration { width: 200px; height: 280px; }
        .decoration-text { font-size: 3rem; }
      }
    `,
      t = a.createElement('style')
    ;(t.textContent = e), document.head.appendChild(t), (this.injected = !0)
  }
}
var g = class {
    constructor(e = 12, t = 1.8, i = 2) {
      this.amplitude = e
      this.speed = t
      this.rotationIntensity = i
    }
    elements = []
    isRunning = !1
    animationId = null
    addElement(e) {
      this.elements.includes(e) || this.elements.push(e)
    }
    removeElement(e) {
      let t = this.elements.indexOf(e)
      t > -1 && this.elements.splice(t, 1)
    }
    start() {
      this.isRunning || ((this.isRunning = !0), this.animate())
    }
    stop() {
      ;(this.isRunning = !1),
        this.animationId !== null &&
          (cancelAnimationFrame(this.animationId), (this.animationId = null)),
        this.elements.forEach(e => {
          a.setStyles(e, { transform: 'translateY(0px) rotate(0deg)' })
        })
    }
    animate() {
      if (!this.isRunning) return
      let e = performance.now() * 0.001
      this.elements.forEach((t, i) => {
        try {
          let r = (i * Math.PI * 2) / this.elements.length,
            n = Math.sin(e * this.speed + r) * this.amplitude,
            o = Math.cos(e * this.speed * 0.7 + r) * (this.amplitude * 0.3),
            l = Math.sin(e * 0.5 + r) * this.rotationIntensity
          a.setStyles(t, {
            transform: `translate3d(${o}px, ${n}px, 0) rotate(${l}deg)`,
            transition: 'transform 0.1s linear',
          })
        } catch (r) {
          console.warn('Error animating element:', r)
        }
      }),
        (this.animationId = requestAnimationFrame(() => this.animate()))
    }
    destroy() {
      this.stop(), (this.elements = [])
    }
  },
  f = class {
    constructor(e) {
      this.container = e
    }
    particles = []
    isRunning = !1
    timeoutId = null
    particleShapes = ['circle', 'square', 'triangle']
    start() {
      this.isRunning || ((this.isRunning = !0), this.createParticles())
    }
    stop() {
      ;(this.isRunning = !1),
        this.timeoutId !== null && (clearTimeout(this.timeoutId), (this.timeoutId = null)),
        this.particles.forEach(e => {
          ;(e.style.animationPlayState = 'paused'), e.remove()
        }),
        (this.particles = [])
    }
    createParticles() {
      if (!this.isRunning) return
      let e = Math.floor(Math.random() * 2) + 3
      for (let t = 0; t < e; t++)
        setTimeout(() => {
          this.isRunning && this.createParticle()
        }, t * 200)
      this.timeoutId = window.setTimeout(() => {
        this.createParticles()
      }, 1800 + Math.random() * 500)
    }
    createParticle() {
      try {
        let e = a.createElement('div', 'particle', { 'aria-hidden': 'true' }),
          t = Math.random() * 6 + 2,
          i = Math.random() * 100,
          r = Math.random() * 3 + 2,
          n = Math.random() * 1,
          o = this.particleShapes[Math.floor(Math.random() * this.particleShapes.length)]
        switch (
          (a.setStyles(e, {
            width: `${t}px`,
            height: `${t}px`,
            left: `${i}%`,
            animationDuration: `${r}s`,
            animationDelay: `${n}s`,
            opacity: '0.7',
          }),
          o)
        ) {
          case 'square':
            a.setStyles(e, { borderRadius: '2px', background: 'currentColor' })
            break
          case 'triangle':
            a.setStyles(e, {
              width: '0px',
              height: '0px',
              background: 'transparent',
              borderLeft: `${t / 2}px solid transparent`,
              borderRight: `${t / 2}px solid transparent`,
              borderBottom: `${t}px solid currentColor`,
            })
            break
          case 'circle':
          default:
            a.setStyles(e, { borderRadius: '50%', background: 'currentColor' })
        }
        this.container.appendChild(e), this.particles.push(e)
        let l = (r + n) * 1e3
        setTimeout(() => {
          e.parentNode && e.remove(), (this.particles = this.particles.filter(c => c !== e))
        }, l)
      } catch (e) {
        console.error('Error creating particle:', e)
      }
    }
    destroy() {
      this.stop()
    }
  },
  d = class {
    constructor(e, t, i = 85, r = 45, n = 1800, o = 500) {
      this.element = e
      this.texts = t
      this.typingSpeed = i
      this.deletingSpeed = r
      this.pauseTime = n
      this.startDelay = o
    }
    currentText = ''
    currentIndex = 0
    isDeleting = !1
    isPaused = !1
    timeoutId = null
    cursorChar = '\u258A'
    start() {
      if (!this.element || !Array.isArray(this.texts) || this.texts.length === 0) {
        console.warn('TypewriterEffect: Invalid element or texts')
        return
      }
      ;(this.isPaused = !1),
        setTimeout(() => {
          this.isPaused || this.type()
        }, this.startDelay)
    }
    stop() {
      ;(this.isPaused = !0),
        this.timeoutId !== null && (clearTimeout(this.timeoutId), (this.timeoutId = null))
    }
    pause() {
      this.isPaused = !0
    }
    resume() {
      this.isPaused && ((this.isPaused = !1), this.type())
    }
    type() {
      if (this.isPaused) return
      let e = this.texts[this.currentIndex]
      if (!e) {
        console.warn('TypewriterEffect: No text available at index', this.currentIndex)
        return
      }
      let t = !this.isDeleting && this.currentText.length < e.length,
        i = this.isDeleting && this.currentText.length > 0,
        r = this.isDeleting && this.currentText.length === 0
      if (t) this.currentText = e.substring(0, this.currentText.length + 1)
      else if (i) this.currentText = e.substring(0, this.currentText.length - 1)
      else if (r) {
        ;(this.isDeleting = !1),
          (this.currentIndex = (this.currentIndex + 1) % this.texts.length),
          (this.timeoutId = window.setTimeout(() => this.type(), 400))
        return
      } else {
        ;(this.isDeleting = !0),
          (this.timeoutId = window.setTimeout(() => this.type(), this.pauseTime))
        return
      }
      this.element.textContent = this.currentText + this.cursorChar
      let o = (this.isDeleting ? this.deletingSpeed : this.typingSpeed) + (Math.random() * 20 - 10)
      this.timeoutId = window.setTimeout(() => this.type(), Math.max(o, 30))
    }
    destroy() {
      this.stop(), (this.element.textContent = '')
    }
  },
  u = class {
    constructor(e) {
      this.container = e
    }
    rippleClass = 'ripple'
    rippleDuration = 600
    createRipple(e, t, i = 'rgba(255, 255, 255, 0.6)') {
      try {
        let r = a.createElement('div', this.rippleClass),
          n = Math.max(this.container.offsetWidth, this.container.offsetHeight) * 0.1
        a.setStyles(r, {
          position: 'absolute',
          left: `${e - n / 2}px`,
          top: `${t - n / 2}px`,
          width: `${n}px`,
          height: `${n}px`,
          background: i,
          borderRadius: '50%',
          transform: 'scale(0)',
          animation: `ripple ${this.rippleDuration}ms linear`,
          pointerEvents: 'none',
          zIndex: '9999',
        }),
          this.container.appendChild(r),
          setTimeout(() => {
            r.parentNode && r.remove()
          }, this.rippleDuration)
      } catch (r) {
        console.error('Error creating ripple:', r)
      }
    }
    attachToElement(e, t) {
      e.addEventListener('click', i => {
        let r = e.getBoundingClientRect(),
          n = i.clientX - r.left,
          o = i.clientY - r.top
        this.createRipple(n, o, t)
      })
    }
    destroy() {
      this.container.querySelectorAll(`.${this.rippleClass}`).forEach(t => t.remove())
    }
  },
  L = `
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
`
if (typeof document < 'u') {
  let s = document.createElement('style')
  ;(s.textContent = L), document.head.appendChild(s)
}
var x = class {
  floatingAnimation
  particleSystem
  typewriterEffect
  rippleEffect
  constructor() {
    ;(this.floatingAnimation = new g()),
      (this.particleSystem = new f(document.body)),
      (this.typewriterEffect = new d(
        a.createElement('span', 'typewriter-text'),
        [
          'Halaman yang kamu cari tidak ditemukan...',
          'Sepertinya tersesat di alam digital?',
          'Mungkin sedang berlibur ke dimensi lain?',
          'Ayo kita kembali ke jalan yang benar!',
          'Setiap developer pernah mengalami ini!',
          'Jangan menyerah - mari explore lagi!',
        ],
        80,
        40,
        2e3
      )),
      (this.rippleEffect = new u(document.body))
  }
  initialize() {
    m.inject(),
      this.render(),
      this.setupEventListeners(),
      this.startAnimations(),
      window.matchMedia('(prefers-color-scheme: dark)').matches &&
        document.body.classList.add('dark-mode')
  }
  render() {
    let e = a.createElement('div', 'container'),
      t = a.createElement('button', 'theme-toggle', { 'aria-label': 'Toggle dark mode' })
    ;(t.innerHTML = '\u{1F319}'), document.body.appendChild(t)
    let i = a.createElement('div', 'particles-container')
    document.body.appendChild(i)
    let r = a.createElement('div', 'error-content'),
      n = a.createElement('div', 'error-code')
    ;(n.textContent = '404'), r.appendChild(n)
    let o = a.createElement('h1', 'error-title')
    ;(o.textContent = 'Oops! Halaman Tidak Ditemukan'), r.appendChild(o)
    let l = a.createElement('p', 'error-description')
    ;(l.textContent =
      'Sepertinya halaman yang kamu cari telah menghilang ke dalam lubang hitam digital atau sedang berpetualang di alam semesta paralel. Jangan khawatir, kita bisa menemukan jalan kembali bersama!'),
      r.appendChild(l)
    let c = a.createElement('div', 'typewriter-container'),
      b = a.createElement('span', 'typewriter-text')
    c.appendChild(b), r.appendChild(c)
    let v = a.createElement('div', 'illustration-container'),
      y = a.createElement('div', 'floating-illustration')
    ;(y.innerHTML = this.createSpaceIllustration()), v.appendChild(y), r.appendChild(v)
    let w = a.createElement('div', 'actions-grid'),
      M = [
        {
          icon: '\u{1F680}',
          title: 'Kembali ke Home',
          description: 'Mulai petualangan dari awal dengan panduan yang benar',
          href: '/',
        },
        {
          icon: '\u{1F50D}',
          title: 'Jelajahi Dokumentasi',
          description: 'Temukan solusi dan panduan lengkap di dokumentasi kami',
          href: '/docs',
        },
        {
          icon: '\u{1F4AB}',
          title: 'Lihat Contoh',
          description: 'Pelajari dari contoh-contoh kode dan implementasi',
          href: '/examples',
        },
        {
          icon: '\u2B50',
          title: 'GitHub Repository',
          description: 'Kontribusi atau eksplorasi kode sumber di GitHub',
          href: 'https://github.com/nxf-oss/lernjs',
        },
      ]
    for (let p of M) {
      let h = a.createElement('a', 'action-card', { href: p.href }),
        E = a.createElement('div', 'action-icon')
      E.textContent = p.icon
      let C = a.createElement('h3', 'action-title')
      C.textContent = p.title
      let T = a.createElement('p', 'action-description')
      ;(T.textContent = p.description),
        h.appendChild(E),
        h.appendChild(C),
        h.appendChild(T),
        w.appendChild(h)
    }
    r.appendChild(w)
    let k = a.createElement('p', 'footer-note')
    ;(k.textContent =
      'Setiap jalan yang salah adalah pelajaran baru menuju solusi yang tepat. Terus eksplorasi!'),
      r.appendChild(k),
      e.appendChild(r),
      document.body.appendChild(e),
      this.floatingAnimation.addElement(n),
      this.floatingAnimation.addElement(y),
      (this.typewriterEffect = new d(b, [
        'Halaman yang kamu cari tidak ditemukan...',
        'Sepertinya tersesat di alam digital?',
        'Mungkin sedang berlibur ke dimensi lain?',
        'Ayo kita kembali ke jalan yang benar!',
        'Setiap developer pernah mengalami ini!',
        'Jangan menyerah - mari explore lagi!',
      ]))
  }
  setupEventListeners() {
    let e = document.querySelector('.theme-toggle')
    e?.addEventListener('click', i => {
      i.stopPropagation(), document.body.classList.toggle('dark-mode')
      let r = document.body.classList.contains('dark-mode')
      ;(e.innerHTML = r ? '\u2600\uFE0F' : '\u{1F319}'),
        this.rippleEffect.createRipple(i.clientX, i.clientY)
    }),
      document.addEventListener('click', i => {
        this.rippleEffect.createRipple(i.clientX, i.clientY)
      })
    let t = document.querySelectorAll('.action-card, .error-code, .floating-illustration')
    for (let i of t)
      a.onVisible(i, () => {
        i.classList.add('animate-in')
      })
  }
  startAnimations() {
    this.floatingAnimation.start(), this.particleSystem.start(), this.typewriterEffect.start()
  }
  createSpaceIllustration() {
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
            let e = Math.random() * 600,
              t = Math.random() * 400,
              i = Math.random() * 1.2 + 0.3,
              r = Math.random() * 0.8 + 0.2
            return `<circle cx="${e}" cy="${t}" r="${i}" opacity="${r}"/>`
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
            ${Array.from({ length: 8 }, (e, t) => {
              let i = (t * 45 * Math.PI) / 180,
                r = 35,
                n = Math.cos(i) * r,
                o = Math.sin(i) * r
              return `<line x1="0" y1="0" x2="${n}" y2="${o}" stroke="#ffd700" stroke-width="2" opacity="0.7"/>`
            }).join('')}
          </g>
        </g>

        <text x="300" y="380" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="18" font-weight="bold" opacity="0.8">
          \u{1F680} Lost in Space \u2022 404 Not Found \u{1F30C}
        </text>
      </svg>
    `
  }
}
document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', () => {
      new x().initialize()
    })
  : new x().initialize()
