interface DocumentationConfig {
  readonly smoothScroll: boolean
  readonly copyFeedback: boolean
  readonly activeSection: boolean
  readonly backToTop: boolean
  readonly themeSync: boolean
  readonly search: boolean
  readonly tabs: boolean
  readonly modals: boolean
  readonly tooltips: boolean
}
interface ScrollTarget extends HTMLElement {
  scrollIntoView(options: ScrollIntoViewOptions): void
}
interface ThemeElement extends HTMLElement {
  dataset: DOMStringMap & {
    theme?: string
  }
}
const CLASS_NAMES = {
  activeLink: 'active-link',
  copyBtn: 'copybtn',
  copied: 'copied',
  darkMode: 'dark-mode',
  modal: 'modal',
  modalContent: 'modal-content',
  modalClose: 'modal-close',
  tab: 'tab',
  tabActive: 'tab-active',
  tooltip: 'tooltip',
} as const
const SELECTORS = {
  internalLink: 'a[href^="#"]',
  heading: 'h2, h3, h4',
  copyButton: '.copybtn',
  modalTrigger: '[data-modal]',
  tabContainer: '.tabs',
  tabButton: '.tab-btn',
  tabContent: '.tab-content',
  tooltipTrigger: '[data-tooltip]',
} as const
const DEFAULT_CONFIG: DocumentationConfig = {
  smoothScroll: true,
  copyFeedback: true,
  activeSection: true,
  backToTop: true,
  themeSync: true,
  search: true,
  tabs: true,
  modals: true,
  tooltips: true,
} as const
class DOMUtils {
  static safeQuerySelector<T extends Element>(selector: string): T | null {
    if (typeof selector !== 'string') {
      throw new Error('Selector must be a string')
    }
    return document.querySelector<T>(selector)
  }
  static safeQuerySelectorAll<T extends Element>(selector: string): NodeListOf<T> {
    if (typeof selector !== 'string') {
      throw new Error('Selector must be a string')
    }
    return document.querySelectorAll<T>(selector)
  }
  static createElement<T extends keyof HTMLElementTagNameMap>(
    tag: T,
    styles?: Partial<CSSStyleDeclaration>,
    classes: readonly string[] = []
  ): HTMLElementTagNameMap[T] {
    const element = document.createElement(tag)
    if (styles) {
      Object.assign(element.style, styles)
    }
    if (classes.length > 0) {
      element.classList.add(...classes)
    }
    return element
  }
  static debounce<T extends (...args: unknown[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: number | undefined
    return (...args: Parameters<T>) => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => func.apply(null, args), delay)
    }
  }
}
class SmoothScrollManager {
  private isInitialized: boolean = false
  constructor() {
    this.init()
  }
  private init(): void {
    if (this.isInitialized) return
    document.body.addEventListener('click', this.handleClick.bind(this))
    this.isInitialized = true
  }
  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null
    const link = target?.closest<HTMLAnchorElement>(SELECTORS.internalLink)
    if (!link?.href) return
    const targetId: string | null = link.getAttribute('href')
    if (!targetId || targetId === '#') return
    const targetElement = DOMUtils.safeQuerySelector<ScrollTarget>(targetId)
    if (targetElement) {
      event.preventDefault()
      this.scrollToElement(targetElement)
      this.updateHistory(targetId)
    }
  }
  private scrollToElement(element: ScrollTarget): void {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
  private updateHistory(hash: string): void {
    window.history.pushState(null, '', hash)
  }
  public destroy(): void {
    document.body.removeEventListener('click', this.handleClick.bind(this))
    this.isInitialized = false
  }
}
class CopyFeedbackManager {
  private isInitialized: boolean = false
  constructor() {
    this.init()
  }
  private init(): void {
    if (this.isInitialized) return
    document.body.addEventListener('click', this.handleCopyClick.bind(this))
    this.isInitialized = true
  }
  private async handleCopyClick(event: MouseEvent): Promise<void> {
    const target = event.target as HTMLElement | null
    const button = target?.closest<HTMLElement>(SELECTORS.copyButton)
    if (!button) return
    const originalContent: string = button.innerHTML
    const codeBlock = button.closest('pre')?.querySelector('code')
    try {
      if (codeBlock?.textContent) {
        await navigator.clipboard.writeText(codeBlock.textContent)
        this.showFeedback(button, originalContent)
      }
    } catch (error) {
      console.error('Failed to copy text:', error)
      this.showError(button, originalContent)
    }
  }
  private showFeedback(button: HTMLElement, originalContent: string): void {
    button.textContent = '✓ Copied!'
    button.classList.add(CLASS_NAMES.copied)
    setTimeout(() => {
      button.innerHTML = originalContent
      button.classList.remove(CLASS_NAMES.copied)
    }, 2000)
  }
  private showError(button: HTMLElement, originalContent: string): void {
    button.textContent = '✗ Failed!'
    setTimeout(() => {
      button.innerHTML = originalContent
    }, 2000)
  }
  public destroy(): void {
    document.body.removeEventListener('click', this.handleCopyClick.bind(this))
    this.isInitialized = false
  }
}
class ActiveSectionManager {
  private observer: IntersectionObserver | null = null
  private currentActive: string | null = null
  private isInitialized: boolean = false
  constructor() {
    this.init()
  }
  private init(): void {
    if (this.isInitialized) return
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    })
    const headings = DOMUtils.safeQuerySelectorAll<HTMLElement>(SELECTORS.heading)
    headings.forEach(heading => {
      if (heading.id && this.observer) {
        this.observer.observe(heading)
      }
    })
    this.isInitialized = true
  }
  private handleIntersection(entries: readonly IntersectionObserverEntry[]): void {
    let closestHeading: { id: string; ratio: number } | null = null
    for (const entry of entries) {
      const target = entry.target
      if (!(target instanceof HTMLElement)) continue
      const id: string = target.id
      if (id.length === 0) continue
      if (entry.isIntersecting) {
        const ratio: number = entry.intersectionRatio
        if (closestHeading === null || ratio > closestHeading.ratio) {
          closestHeading = { id, ratio }
        }
      }
    }
    if (closestHeading !== null) {
      const { id } = closestHeading
      if (id !== this.currentActive) {
        this.updateActiveLink(id)
      }
    }
  }
  private updateActiveLink(activeId: string): void {
    const currentActiveLinks = DOMUtils.safeQuerySelectorAll<HTMLAnchorElement>(
      `.${CLASS_NAMES.activeLink}`
    )
    currentActiveLinks.forEach(link => {
      link.classList.remove(CLASS_NAMES.activeLink)
    })
    const newActiveLink = DOMUtils.safeQuerySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`)
    if (newActiveLink) {
      newActiveLink.classList.add(CLASS_NAMES.activeLink)
      this.currentActive = activeId
    }
  }
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.isInitialized = false
  }
}
class BackToTopManager {
  private button: HTMLButtonElement | null = null
  private isInitialized: boolean = false
  constructor() {
    this.init()
  }
  private init(): void {
    if (this.isInitialized) return
    this.createButton()
    this.setupEventListeners()
    this.isInitialized = true
  }
  private createButton(): void {
    this.button = DOMUtils.createElement(
      'button',
      {
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        padding: '0.5rem 0.7rem',
        borderRadius: '8px',
        border: 'none',
        background: 'var(--color-primary, #2563eb)',
        color: '#fff',
        fontSize: '18px',
        cursor: 'pointer',
        opacity: '0',
        transition: 'opacity 0.3s ease, transform 0.2s ease',
        zIndex: '1000',
        transform: 'translateY(10px)',
      },
      ['back-to-top']
    )
    this.button.textContent = '↑'
    this.button.setAttribute('aria-label', 'Back to top')
    document.body.appendChild(this.button)
  }
  private setupEventListeners(): void {
    if (!this.button) return
    const handleScroll = DOMUtils.debounce(() => {
      if (!this.button) return
      const shouldShow = window.scrollY > 300
      this.button.style.opacity = shouldShow ? '1' : '0'
      this.button.style.transform = shouldShow ? 'translateY(0)' : 'translateY(10px)'
    }, 10)
    window.addEventListener('scroll', handleScroll)
    this.button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }
  public destroy(): void {
    if (this.button) {
      this.button.remove()
      this.button = null
    }
    this.isInitialized = false
  }
}
class ThemeSyncManager {
  private observer: MutationObserver | null = null
  private isInitialized: boolean = false
  constructor() {
    this.init()
  }
  private init(): void {
    if (this.isInitialized) return
    this.observer = new MutationObserver(this.handleThemeChange.bind(this))
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    this.handleThemeChange()
    this.isInitialized = true
  }
  private handleThemeChange(): void {
    const isDark = (document.documentElement as ThemeElement).dataset.theme === 'dark'
    document.body.classList.toggle(CLASS_NAMES.darkMode, isDark)
    const event = new CustomEvent('themechange', {
      detail: { isDark },
    })
    document.dispatchEvent(event)
  }
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.isInitialized = false
  }
}
class TabManager {
  private isInitialized: boolean = false
  constructor() {
    this.init()
  }
  private init(): void {
    if (this.isInitialized) return
    const tabContainers = DOMUtils.safeQuerySelectorAll<HTMLElement>(SELECTORS.tabContainer)
    tabContainers.forEach(container => {
      this.setupTabContainer(container)
    })
    this.isInitialized = true
  }
  private setupTabContainer(container: HTMLElement): void {
    const tabButtons = container.querySelectorAll<HTMLButtonElement>(SELECTORS.tabButton)
    const tabContents = container.querySelectorAll<HTMLElement>(SELECTORS.tabContent)
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-tab')
        if (!targetId) return
        this.activateTab(container, targetId, tabButtons, tabContents)
      })
    })
    const firstButton = tabButtons[0]
    if (firstButton) {
      const firstTarget = firstButton.getAttribute('data-tab')
      if (firstTarget) {
        this.activateTab(container, firstTarget, tabButtons, tabContents)
      }
    }
  }
  private activateTab(
    container: HTMLElement,
    targetId: string,
    buttons: NodeListOf<HTMLButtonElement>,
    contents: NodeListOf<HTMLElement>
  ): void {
    buttons.forEach(btn => btn.classList.remove(CLASS_NAMES.tabActive))
    contents.forEach(content => content.classList.remove(CLASS_NAMES.tabActive))
    const activeButton = container.querySelector<HTMLButtonElement>(`[data-tab="${targetId}"]`)
    const activeContent = container.querySelector<HTMLElement>(`#${targetId}`)
    if (activeButton && activeContent) {
      activeButton.classList.add(CLASS_NAMES.tabActive)
      activeContent.classList.add(CLASS_NAMES.tabActive)
    }
  }
  public destroy(): void {
    this.isInitialized = false
  }
}
class ModalManager {
  private isInitialized: boolean = false
  constructor() {
    this.init()
  }
  private init(): void {
    if (this.isInitialized) return
    document.body.addEventListener('click', this.handleModalTrigger.bind(this))
    document.body.addEventListener('click', this.handleModalClose.bind(this))
    document.addEventListener('keydown', this.handleEscape.bind(this))
    this.isInitialized = true
  }
  private handleModalTrigger(event: MouseEvent): void {
    const target = event.target as HTMLElement | null
    const trigger = target?.closest<HTMLElement>(SELECTORS.modalTrigger)
    if (!trigger) return
    const modalId = trigger.getAttribute('data-modal')
    if (!modalId) return
    const modal = DOMUtils.safeQuerySelector<HTMLElement>(`#${modalId}`)
    if (modal) {
      event.preventDefault()
      this.openModal(modal)
    }
  }
  private handleModalClose(event: MouseEvent): void {
    const target = event.target as HTMLElement | null
    if (
      target?.classList.contains(CLASS_NAMES.modal) ||
      target?.classList.contains(CLASS_NAMES.modalClose) ||
      target?.closest(`.${CLASS_NAMES.modalClose}`)
    ) {
      this.closeCurrentModal()
    }
  }
  private handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeCurrentModal()
    }
  }
  private openModal(modal: HTMLElement): void {
    modal.style.display = 'block'
    document.body.style.overflow = 'hidden'
    setTimeout(() => {
      modal.classList.add('active')
    }, 10)
  }
  private closeCurrentModal(): void {
    const activeModal = DOMUtils.safeQuerySelector<HTMLElement>(`.${CLASS_NAMES.modal}.active`)
    if (activeModal) {
      activeModal.classList.remove('active')
      document.body.style.overflow = ''
      setTimeout(() => {
        activeModal.style.display = 'none'
      }, 300)
    }
  }
  public destroy(): void {
    document.body.removeEventListener('click', this.handleModalTrigger.bind(this))
    document.body.removeEventListener('click', this.handleModalClose.bind(this))
    document.removeEventListener('keydown', this.handleEscape.bind(this))
    this.isInitialized = false
  }
}
class SphinxDocumentation {
  private config: DocumentationConfig
  private managers: Map<string, unknown> = new Map()
  private isInitialized: boolean = false
  constructor(userConfig: Partial<DocumentationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...userConfig }
    this.init()
  }
  public init(): void {
    if (this.isInitialized || document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeManagers())
    } else {
      this.initializeManagers()
    }
  }
  private initializeManagers(): void {
    if (this.isInitialized) return
    try {
      if (this.config.smoothScroll) {
        this.managers.set('smoothScroll', new SmoothScrollManager())
      }
      if (this.config.copyFeedback) {
        this.managers.set('copyFeedback', new CopyFeedbackManager())
      }
      if (this.config.activeSection) {
        this.managers.set('activeSection', new ActiveSectionManager())
      }
      if (this.config.backToTop) {
        this.managers.set('backToTop', new BackToTopManager())
      }
      if (this.config.themeSync) {
        this.managers.set('themeSync', new ThemeSyncManager())
      }
      if (this.config.tabs) {
        this.managers.set('tabs', new TabManager())
      }
      if (this.config.modals) {
        this.managers.set('modals', new ModalManager())
      }
      this.isInitialized = true
      console.log('Sphinx Documentation initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Sphinx Documentation:', error)
    }
  }
  public getManager<T>(name: string): T | undefined {
    return this.managers.get(name) as T | undefined
  }
  public destroy(): void {
    this.managers.forEach(manager => {
      if (typeof (manager as { destroy?: () => void }).destroy === 'function') {
        ;(manager as { destroy: () => void }).destroy()
      }
    })
    this.managers.clear()
    this.isInitialized = false
  }
  public updateConfig(newConfig: Partial<DocumentationConfig>): void {
    this.destroy()
    this.config = { ...this.config, ...newConfig }
    this.initializeManagers()
  }
}
declare global {
  interface Window {
    SphinxDocs: SphinxDocumentation
  }
}
const initSphinxDocumentation = (): void => {
  try {
    window.SphinxDocs = new SphinxDocumentation()
  } catch (error) {
    console.error('Failed to initialize Sphinx Documentation:', error)
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSphinxDocumentation)
} else {
  initSphinxDocumentation()
}
export default SphinxDocumentation
