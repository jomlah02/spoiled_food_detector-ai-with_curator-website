// Animasi ringan untuk perpindahan halaman dan langkah, plus dukungan reduced-motion.
const GLOBAL_CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes stepIn {
    from { opacity: 0; transform: translateX(16px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
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
