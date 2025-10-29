import { DOM } from './dom'
export class StyleInjector {
  private static injected = false
  static inject(): void {
    if (this.injected) return
    const styles = `
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
    `
    const styleElement = DOM.createElement('style')
    styleElement.textContent = styles
    document.head.appendChild(styleElement)
    this.injected = true
  }
}
