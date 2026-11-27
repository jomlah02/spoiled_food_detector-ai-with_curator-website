const GLOBAL_CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes stepIn {
    from { opacity: 0; transform: translateX(14px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes labelIn {
    from { opacity: 0; transform: translateY(-10px) rotate(-1.5deg); }
    to { opacity: 1; transform: translateY(0) rotate(0); }
  }

  @keyframes stampIn {
    0% { opacity: 0; transform: scale(1.6) rotate(-8deg); }
    60% { opacity: 1; transform: scale(0.94) rotate(-3deg); }
    100% { opacity: 1; transform: scale(1) rotate(-3deg); }
  }

  body {
    transition: background-color 0.3s ease, color 0.3s ease;
    -webkit-tap-highlight-color: transparent;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`

function GlobalStyles() {
  return <style>{GLOBAL_CSS}</style>
}

export default GlobalStyles
