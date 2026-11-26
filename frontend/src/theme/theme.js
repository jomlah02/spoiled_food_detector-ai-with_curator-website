import { extendTheme } from '@chakra-ui/react'

// Satu token = satu warna untuk mode terang dan gelap.
const t = (light, dark) => ({ default: light, _dark: dark })

export const theme = extendTheme({
  config: {
    // Terang sebagai default: aplikasi ini dipakai di dapur pada siang hari.
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'Figtree', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  semanticTokens: {
    colors: {
      // Permukaan
      'bg.canvas': t('#FAF7F0', '#121714'),
      'bg.surface': t('#FFFFFF', '#1A211D'),
      'bg.muted': t('#F2EEE4', '#232C27'),

      // Teks & garis
      fg: t('#1E2A23', '#ECF1EC'),
      'fg.muted': t('#5F6B63', '#9AA89F'),
      'fg.subtle': t('#858F88', '#76847B'),
      border: t('#E4DED2', '#2C3630'),
      'border.strong': t('#CFC7B6', '#3D4A42'),

      // Brand: hijau herbal
      brand: t('#2F6B4F', '#7DB894'),
      'brand.hover': t('#1F4A37', '#94C9A8'),
      'brand.fg': t('#FFFFFF', '#10201A'),
      'brand.subtle': t('#E3EFE7', '#1C3326'),
      'brand.subtleFg': t('#1F4A37', '#CBE6D5'),

      // Status: hanya untuk hasil penilaian, bukan dekorasi
      'status.ok': t('#2E7D4F', '#6FBF8E'),
      'status.ok.bg': t('#E6F3EA', '#16301F'),
      'status.ok.fg': t('#1D5636', '#CDEBD7'),
      'status.caution': t('#B7791F', '#E5AC4C'),
      'status.caution.bg': t('#FDF3E1', '#33260F'),
      'status.caution.fg': t('#6B460B', '#F6D594'),
      'status.danger': t('#C0392B', '#E57367'),
      'status.danger.bg': t('#FBE9E7', '#3A1915'),
      'status.danger.fg': t('#7A2318', '#F6B9B1'),
      'status.info': t('#4A6FA5', '#86A8D8'),
      'status.info.bg': t('#E8EEF7', '#1A2638'),
      'status.info.fg': t('#2C4669', '#CFDDF2'),
    },
  },
  styles: {
    global: {
      body: {
        bg: 'bg.canvas',
        color: 'fg',
      },
    },
  },
  components: {
    Heading: {
      baseStyle: { color: 'fg', letterSpacing: '-0.01em' },
    },
    Button: {
      baseStyle: {
        borderRadius: 'xl',
        fontWeight: 'semibold',
        _active: { transform: 'scale(0.98)' },
      },
      variants: {
        primary: {
          bg: 'brand',
          color: 'brand.fg',
          _hover: { bg: 'brand.hover', _disabled: { bg: 'brand' } },
        },
        danger: {
          bg: 'status.danger',
          color: 'white',
          _hover: { opacity: 0.9 },
        },
        secondary: {
          bg: 'bg.surface',
          color: 'fg',
          border: '1px solid',
          borderColor: 'border.strong',
          _hover: { bg: 'bg.muted' },
        },
        ghost: {
          color: 'fg.muted',
          _hover: { bg: 'bg.muted', color: 'fg' },
          _active: { bg: 'bg.muted' },
        },
      },
      defaultProps: { variant: 'secondary' },
    },
    Input: {
      defaultProps: { focusBorderColor: 'brand' },
      variants: {
        outline: {
          field: {
            bg: 'bg.surface',
            borderColor: 'border.strong',
            borderRadius: 'xl',
            _hover: { borderColor: 'fg.subtle' },
            _placeholder: { color: 'fg.subtle' },
          },
        },
      },
    },
    Textarea: {
      defaultProps: { focusBorderColor: 'brand' },
      variants: {
        outline: {
          bg: 'bg.surface',
          borderColor: 'border.strong',
          borderRadius: 'xl',
          _hover: { borderColor: 'fg.subtle' },
          _placeholder: { color: 'fg.subtle' },
        },
      },
    },
    Switch: {
      baseStyle: {
        track: {
          bg: 'border.strong',
          _checked: { bg: 'brand' },
        },
      },
    },
  },
})
