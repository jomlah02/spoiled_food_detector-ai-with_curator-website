import { extendTheme } from '@chakra-ui/react'

// Arah desain "Label dapur": kertas, tinta, selotip, dan stempel.
// Satu token = satu warna untuk mode terang dan gelap.
const t = (light, dark) => ({ default: light, _dark: dark })

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'Fraunces', Georgia, serif`,
    body: `'IBM Plex Sans', system-ui, sans-serif`,
    mono: `'IBM Plex Mono', ui-monospace, monospace`,
  },
  radii: {
    label: '3px',
  },
  semanticTokens: {
    colors: {
      // Kertas & label
      'bg.canvas': t('#F2ECDF', '#171612'),
      'bg.surface': t('#FBF8F0', '#22201A'),
      'bg.muted': t('#E9E2D2', '#2B2820'),
      tape: t('#E3D5B0', '#4A4231'),

      // Tinta
      fg: t('#1A1A17', '#EFE9DA'),
      'fg.muted': t('#5C574C', '#B0A893'),
      'fg.subtle': t('#8A8475', '#7F7866'),
      'ink.fg': t('#FBF8F0', '#171612'), // teks di atas blok tinta
      border: t('#1A1A17', '#8C8470'),
      'border.soft': t('#CFC6B2', '#3A372D'),

      // Hijau CuPI, dipakai hemat
      brand: t('#2F6B4F', '#8FC4A3'),

      // Warna tinta stempel status
      'status.ok': t('#2F6B4F', '#8FC4A3'),
      'status.ok.bg': t('#E6EDDF', '#1D2A21'),
      'status.caution': t('#A86A12', '#E5AC4C'),
      'status.caution.bg': t('#F5E9CF', '#33280F'),
      'status.danger': t('#B8321F', '#F08A7B'),
      'status.danger.bg': t('#F6E1DA', '#3A1C16'),
      'status.info': t('#3F5F8F', '#9DB8E0'),
      'status.info.bg': t('#E3E8EF', '#1C2433'),
    },
  },
  textStyles: {
    // Huruf mesin ketik untuk label, tanggal, dan keterangan kecil
    mono: {
      fontFamily: 'mono',
      fontSize: 'xs',
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'bg.canvas',
        color: 'fg',
        fontFamily: 'body',
      },
      '::selection': { bg: 'tape' },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: 'fg',
        fontWeight: 600,
        letterSpacing: '-0.02em',
        fontVariationSettings: '"opsz" 72',
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 'label',
        fontFamily: 'mono',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        _active: { transform: 'translateY(1px)' },
      },
      sizes: {
        lg: { fontSize: 'sm', h: 12, px: 6 },
        md: { fontSize: 'xs', h: 10, px: 4 },
        sm: { fontSize: '11px', h: 8, px: 3 },
      },
      variants: {
        primary: {
          bg: 'fg',
          color: 'ink.fg',
          _hover: { bg: 'fg.muted', _disabled: { bg: 'fg' } },
        },
        danger: {
          bg: 'status.danger',
          color: 'ink.fg',
          _hover: { opacity: 0.88 },
        },
        secondary: {
          bg: 'transparent',
          color: 'fg',
          border: '1.5px solid',
          borderColor: 'border',
          _hover: { bg: 'bg.muted' },
        },
        ghost: {
          color: 'fg.muted',
          _hover: { color: 'fg', bg: 'transparent', textDecoration: 'underline' },
          _active: { bg: 'transparent' },
        },
      },
      defaultProps: { variant: 'secondary', size: 'md' },
    },
    Input: {
      defaultProps: { focusBorderColor: 'fg' },
      variants: {
        outline: {
          field: {
            bg: 'bg.surface',
            border: '1.5px solid',
            borderColor: 'border',
            borderRadius: 'label',
            _hover: { borderColor: 'border' },
            _placeholder: { color: 'fg.subtle' },
          },
        },
      },
    },
    Textarea: {
      defaultProps: { focusBorderColor: 'fg' },
      variants: {
        outline: {
          bg: 'bg.surface',
          border: '1.5px solid',
          borderColor: 'border',
          borderRadius: 'label',
          _hover: { borderColor: 'border' },
          _placeholder: { color: 'fg.subtle' },
        },
      },
    },
    Switch: {
      baseStyle: {
        track: {
          bg: 'border.soft',
          _checked: { bg: 'fg' },
        },
        thumb: { bg: 'bg.surface' },
      },
    },
  },
})
