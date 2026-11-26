import { useColorModeValue } from '@chakra-ui/react'

// Semua token warna CuPI (mode terang/gelap) di satu tempat.
export function useCupiTokens() {
  // Design Tokens CuPI (Fresh Botanical Green + Warm Food Neutrals)
  const bgMain = useColorModeValue('#E8F1E5', '#0E1A13')
  const surfaceSage = useColorModeValue('#F0F5ED', '#15251B')
  const surfaceCream = useColorModeValue('#F6F4E9', '#1A2D21')
  const surfaceInteractive = useColorModeValue('#DCE9D7', '#213829')
  const primaryGreen = useColorModeValue('#285B3D', '#78A96B')
  const primaryBtnBg = useColorModeValue('#285B3D', '#78A96B')
  const primaryBtnText = useColorModeValue('#F6F4E9', '#0E1A13')
  const primaryBtnHover = useColorModeValue('#1F4930', '#8AB97D')
  const freshGreen = useColorModeValue('#78A96B', '#5E8E53')
  const textMain = useColorModeValue('#203329', '#EEF3EC')
  const textMuted = useColorModeValue('#65766A', '#9BB0A1')
  const borderSubtle = useColorModeValue('#C5D7C0', '#273F30')
  const borderStrong = useColorModeValue('#97B891', '#3B5E47')
  const inputBg = useColorModeValue('#FAFBF8', '#101E15')

  // Warna Status
  const amberStatus = useColorModeValue('#D99A38', '#E5AC4C')
  const amberBg = useColorModeValue('#F7EEDB', '#322614')
  const amberText = useColorModeValue('#6B460B', '#F6D594')

  const redStatus = useColorModeValue('#B9574F', '#DF7870')
  const redBg = useColorModeValue('#F6E5E3', '#351A19')
  const redText = useColorModeValue('#70231D', '#F6B6B1')

  const infoStatus = useColorModeValue('#4A6B54', '#88AE93')
  const infoBg = useColorModeValue('#E2ECE3', '#1E3326')
  const infoText = useColorModeValue('#1F3828', '#D4E6DA')

  const elevatedShadow = useColorModeValue(
    '0 8px 24px rgba(32, 51, 41, 0.06), 0 1px 3px rgba(32, 51, 41, 0.04)',
    '0 12px 28px rgba(3, 8, 5, 0.6), 0 2px 6px rgba(3, 8, 5, 0.4)'
  )

  const getStatusTokens = (status) => {
    if (status === 'Risiko terindikasi') {
      return {
        accent: redStatus,
        bg: redBg,
        text: redText,
      }
    }
    if (status === 'Perlu perhatian') {
      return {
        accent: amberStatus,
        bg: amberBg,
        text: amberText,
      }
    }
    return {
      accent: infoStatus,
      bg: infoBg,
      text: infoText,
    }
  }

  return {
    bgMain,
    surfaceSage,
    surfaceCream,
    surfaceInteractive,
    primaryGreen,
    primaryBtnBg,
    primaryBtnText,
    primaryBtnHover,
    freshGreen,
    textMain,
    textMuted,
    borderSubtle,
    borderStrong,
    inputBg,
    amberStatus,
    amberBg,
    amberText,
    redStatus,
    redBg,
    redText,
    infoStatus,
    infoBg,
    infoText,
    elevatedShadow,
    getStatusTokens,
  }
}
