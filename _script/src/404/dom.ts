export type CSSClass = string | string[] | Record<string, boolean>

export class DOM {
  static createElement<T extends keyof HTMLElementTagNameMap>(
    tag: T,
    classes?: CSSClass,
    attributes: Record<string, string> = {}
  ): HTMLElementTagNameMap[T] {
    const element = document.createElement(tag)

    if (classes) {
      this.addClasses(element, classes)
    }

    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value)
    }

    return element
  }

  static addClasses(element: HTMLElement, classes: CSSClass): void {
    if (typeof classes === 'string') {
      element.classList.add(classes)
    } else if (Array.isArray(classes)) {
      element.classList.add(...classes)
    } else {
      for (const [className, shouldAdd] of Object.entries(classes)) {
        if (shouldAdd) {
          element.classList.add(className)
        }
      }
    }
  }

  static setStyles(element: HTMLElement, styles: Record<string, string>): void {
    for (const [property, value] of Object.entries(styles)) {
      ;(element.style as any)[property] = value
    }
  }

  static waitFor(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static onVisible(element: HTMLElement, callback: () => void): void {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          callback()
          observer.unobserve(element)
        }
      }
    })

    observer.observe(element)
  }
}
