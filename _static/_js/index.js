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
};
const SELECTORS = {
    internalLink: 'a[href^="#"]',
    heading: 'h2, h3, h4',
    copyButton: '.copybtn',
    modalTrigger: '[data-modal]',
    tabContainer: '.tabs',
    tabButton: '.tab-btn',
    tabContent: '.tab-content',
    tooltipTrigger: '[data-tooltip]',
};
const DEFAULT_CONFIG = {
    smoothScroll: true,
    copyFeedback: true,
    activeSection: true,
    backToTop: true,
    themeSync: true,
    search: true,
    tabs: true,
    modals: true,
    tooltips: true,
};
class DOMUtils {
    static safeQuerySelector(selector) {
        if (typeof selector !== 'string') {
            throw new Error('Selector must be a string');
        }
        return document.querySelector(selector);
    }
    static safeQuerySelectorAll(selector) {
        if (typeof selector !== 'string') {
            throw new Error('Selector must be a string');
        }
        return document.querySelectorAll(selector);
    }
    static createElement(tag, styles, classes = []) {
        const element = document.createElement(tag);
        if (styles) {
            Object.assign(element.style, styles);
        }
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
        return element;
    }
    static debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => func.apply(null, args), delay);
        };
    }
}
class SmoothScrollManager {
    isInitialized = false;
    constructor() {
        this.init();
    }
    init() {
        if (this.isInitialized)
            return;
        document.body.addEventListener('click', this.handleClick.bind(this));
        this.isInitialized = true;
    }
    handleClick(event) {
        const target = event.target;
        const link = target?.closest(SELECTORS.internalLink);
        if (!link?.href)
            return;
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#')
            return;
        const targetElement = DOMUtils.safeQuerySelector(targetId);
        if (targetElement) {
            event.preventDefault();
            this.scrollToElement(targetElement);
            this.updateHistory(targetId);
        }
    }
    scrollToElement(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
    updateHistory(hash) {
        window.history.pushState(null, '', hash);
    }
    destroy() {
        document.body.removeEventListener('click', this.handleClick.bind(this));
        this.isInitialized = false;
    }
}
class CopyFeedbackManager {
    isInitialized = false;
    constructor() {
        this.init();
    }
    init() {
        if (this.isInitialized)
            return;
        document.body.addEventListener('click', this.handleCopyClick.bind(this));
        this.isInitialized = true;
    }
    async handleCopyClick(event) {
        const target = event.target;
        const button = target?.closest(SELECTORS.copyButton);
        if (!button)
            return;
        const originalContent = button.innerHTML;
        const codeBlock = button.closest('pre')?.querySelector('code');
        try {
            if (codeBlock?.textContent) {
                await navigator.clipboard.writeText(codeBlock.textContent);
                this.showFeedback(button, originalContent);
            }
        }
        catch (error) {
            console.error('Failed to copy text:', error);
            this.showError(button, originalContent);
        }
    }
    showFeedback(button, originalContent) {
        button.textContent = '✓ Copied!';
        button.classList.add(CLASS_NAMES.copied);
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove(CLASS_NAMES.copied);
        }, 2000);
    }
    showError(button, originalContent) {
        button.textContent = '✗ Failed!';
        setTimeout(() => {
            button.innerHTML = originalContent;
        }, 2000);
    }
    destroy() {
        document.body.removeEventListener('click', this.handleCopyClick.bind(this));
        this.isInitialized = false;
    }
}
class ActiveSectionManager {
    observer = null;
    currentActive = null;
    isInitialized = false;
    constructor() {
        this.init();
    }
    init() {
        if (this.isInitialized)
            return;
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0.1,
        });
        const headings = DOMUtils.safeQuerySelectorAll(SELECTORS.heading);
        headings.forEach(heading => {
            if (heading.id && this.observer) {
                this.observer.observe(heading);
            }
        });
        this.isInitialized = true;
    }
    handleIntersection(entries) {
        let closestHeading = null;
        for (const entry of entries) {
            const target = entry.target;
            if (!(target instanceof HTMLElement))
                continue;
            const id = target.id;
            if (id.length === 0)
                continue;
            if (entry.isIntersecting) {
                const ratio = entry.intersectionRatio;
                if (closestHeading === null || ratio > closestHeading.ratio) {
                    closestHeading = { id, ratio };
                }
            }
        }
        if (closestHeading !== null) {
            const { id } = closestHeading;
            if (id !== this.currentActive) {
                this.updateActiveLink(id);
            }
        }
    }
    updateActiveLink(activeId) {
        const currentActiveLinks = DOMUtils.safeQuerySelectorAll(`.${CLASS_NAMES.activeLink}`);
        currentActiveLinks.forEach(link => {
            link.classList.remove(CLASS_NAMES.activeLink);
        });
        const newActiveLink = DOMUtils.safeQuerySelector(`a[href="#${activeId}"]`);
        if (newActiveLink) {
            newActiveLink.classList.add(CLASS_NAMES.activeLink);
            this.currentActive = activeId;
        }
    }
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.isInitialized = false;
    }
}
class BackToTopManager {
    button = null;
    isInitialized = false;
    constructor() {
        this.init();
    }
    init() {
        if (this.isInitialized)
            return;
        this.createButton();
        this.setupEventListeners();
        this.isInitialized = true;
    }
    createButton() {
        this.button = DOMUtils.createElement('button', {
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
        }, ['back-to-top']);
        this.button.textContent = '↑';
        this.button.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(this.button);
    }
    setupEventListeners() {
        if (!this.button)
            return;
        const handleScroll = DOMUtils.debounce(() => {
            if (!this.button)
                return;
            const shouldShow = window.scrollY > 300;
            this.button.style.opacity = shouldShow ? '1' : '0';
            this.button.style.transform = shouldShow ? 'translateY(0)' : 'translateY(10px)';
        }, 10);
        window.addEventListener('scroll', handleScroll);
        this.button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    destroy() {
        if (this.button) {
            this.button.remove();
            this.button = null;
        }
        this.isInitialized = false;
    }
}
class ThemeSyncManager {
    observer = null;
    isInitialized = false;
    constructor() {
        this.init();
    }
    init() {
        if (this.isInitialized)
            return;
        this.observer = new MutationObserver(this.handleThemeChange.bind(this));
        this.observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });
        this.handleThemeChange();
        this.isInitialized = true;
    }
    handleThemeChange() {
        const isDark = document.documentElement.dataset.theme === 'dark';
        document.body.classList.toggle(CLASS_NAMES.darkMode, isDark);
        const event = new CustomEvent('themechange', {
            detail: { isDark },
        });
        document.dispatchEvent(event);
    }
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.isInitialized = false;
    }
}
class TabManager {
    isInitialized = false;
    constructor() {
        this.init();
    }
    init() {
        if (this.isInitialized)
            return;
        const tabContainers = DOMUtils.safeQuerySelectorAll(SELECTORS.tabContainer);
        tabContainers.forEach(container => {
            this.setupTabContainer(container);
        });
        this.isInitialized = true;
    }
    setupTabContainer(container) {
        const tabButtons = container.querySelectorAll(SELECTORS.tabButton);
        const tabContents = container.querySelectorAll(SELECTORS.tabContent);
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-tab');
                if (!targetId)
                    return;
                this.activateTab(container, targetId, tabButtons, tabContents);
            });
        });
        const firstButton = tabButtons[0];
        if (firstButton) {
            const firstTarget = firstButton.getAttribute('data-tab');
            if (firstTarget) {
                this.activateTab(container, firstTarget, tabButtons, tabContents);
            }
        }
    }
    activateTab(container, targetId, buttons, contents) {
        buttons.forEach(btn => btn.classList.remove(CLASS_NAMES.tabActive));
        contents.forEach(content => content.classList.remove(CLASS_NAMES.tabActive));
        const activeButton = container.querySelector(`[data-tab="${targetId}"]`);
        const activeContent = container.querySelector(`#${targetId}`);
        if (activeButton && activeContent) {
            activeButton.classList.add(CLASS_NAMES.tabActive);
            activeContent.classList.add(CLASS_NAMES.tabActive);
        }
    }
    destroy() {
        this.isInitialized = false;
    }
}
class ModalManager {
    isInitialized = false;
    constructor() {
        this.init();
    }
    init() {
        if (this.isInitialized)
            return;
        document.body.addEventListener('click', this.handleModalTrigger.bind(this));
        document.body.addEventListener('click', this.handleModalClose.bind(this));
        document.addEventListener('keydown', this.handleEscape.bind(this));
        this.isInitialized = true;
    }
    handleModalTrigger(event) {
        const target = event.target;
        const trigger = target?.closest(SELECTORS.modalTrigger);
        if (!trigger)
            return;
        const modalId = trigger.getAttribute('data-modal');
        if (!modalId)
            return;
        const modal = DOMUtils.safeQuerySelector(`#${modalId}`);
        if (modal) {
            event.preventDefault();
            this.openModal(modal);
        }
    }
    handleModalClose(event) {
        const target = event.target;
        if (target?.classList.contains(CLASS_NAMES.modal) ||
            target?.classList.contains(CLASS_NAMES.modalClose) ||
            target?.closest(`.${CLASS_NAMES.modalClose}`)) {
            this.closeCurrentModal();
        }
    }
    handleEscape(event) {
        if (event.key === 'Escape') {
            this.closeCurrentModal();
        }
    }
    openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
    closeCurrentModal() {
        const activeModal = DOMUtils.safeQuerySelector(`.${CLASS_NAMES.modal}.active`);
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                activeModal.style.display = 'none';
            }, 300);
        }
    }
    destroy() {
        document.body.removeEventListener('click', this.handleModalTrigger.bind(this));
        document.body.removeEventListener('click', this.handleModalClose.bind(this));
        document.removeEventListener('keydown', this.handleEscape.bind(this));
        this.isInitialized = false;
    }
}
class SphinxDocumentation {
    config;
    managers = new Map();
    isInitialized = false;
    constructor(userConfig = {}) {
        this.config = { ...DEFAULT_CONFIG, ...userConfig };
        this.init();
    }
    init() {
        if (this.isInitialized || document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeManagers());
        }
        else {
            this.initializeManagers();
        }
    }
    initializeManagers() {
        if (this.isInitialized)
            return;
        try {
            if (this.config.smoothScroll) {
                this.managers.set('smoothScroll', new SmoothScrollManager());
            }
            if (this.config.copyFeedback) {
                this.managers.set('copyFeedback', new CopyFeedbackManager());
            }
            if (this.config.activeSection) {
                this.managers.set('activeSection', new ActiveSectionManager());
            }
            if (this.config.backToTop) {
                this.managers.set('backToTop', new BackToTopManager());
            }
            if (this.config.themeSync) {
                this.managers.set('themeSync', new ThemeSyncManager());
            }
            if (this.config.tabs) {
                this.managers.set('tabs', new TabManager());
            }
            if (this.config.modals) {
                this.managers.set('modals', new ModalManager());
            }
            this.isInitialized = true;
            console.log('Sphinx Documentation initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize Sphinx Documentation:', error);
        }
    }
    getManager(name) {
        return this.managers.get(name);
    }
    destroy() {
        this.managers.forEach(manager => {
            if (typeof manager.destroy === 'function') {
                ;
                manager.destroy();
            }
        });
        this.managers.clear();
        this.isInitialized = false;
    }
    updateConfig(newConfig) {
        this.destroy();
        this.config = { ...this.config, ...newConfig };
        this.initializeManagers();
    }
}
const initSphinxDocumentation = () => {
    try {
        window.SphinxDocs = new SphinxDocumentation();
    }
    catch (error) {
        console.error('Failed to initialize Sphinx Documentation:', error);
    }
};
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSphinxDocumentation);
}
else {
    initSphinxDocumentation();
}
export default SphinxDocumentation;
//# sourceMappingURL=index.js.map