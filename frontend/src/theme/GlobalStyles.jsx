// Transisi warna, keyframes animasi, dan dukungan reduced-motion untuk seluruh aplikasi.
const GLOBAL_CSS = `
  .cupi-root-transition,
  .cupi-root-transition nav,
  .cupi-root-transition footer,
  .cupi-root-transition button,
  .cupi-root-transition input,
  .cupi-root-transition select,
  .cupi-root-transition textarea,
  .cupi-root-transition [data-cupi-el="true"] {
    transition:
      background-color 0.34s cubic-bezier(0.22, 1, 0.36, 1),
      border-color 0.34s cubic-bezier(0.22, 1, 0.36, 1),
      color 0.28s cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 0.34s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes dropUnblur {
    from {
      opacity: 0;
      transform: translateY(-14px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes contentReveal {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes iconSwitch {
    from {
      opacity: 0;
      transform: rotate(-70deg) scale(0.55);
    }
    to {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
  }

  @keyframes pageFadeUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes loadingDotPulse {
    0%, 100% {
      opacity: 0.95;
      transform: scale(1);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.25);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.12s !important;
    }
  }
`

function GlobalStyles() {
  return <style>{GLOBAL_CSS}</style>
}

export default GlobalStyles
