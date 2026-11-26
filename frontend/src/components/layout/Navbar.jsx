import { Box, Flex, HStack, Text, useColorMode } from '@chakra-ui/react'
import { NAV_ITEMS } from '../../constants/navigation'
import { useCupiTokens } from '../../theme/useCupiTokens'

function Navbar({ activeNav, setActiveNav }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const {
    surfaceSage,
    surfaceCream,
    surfaceInteractive,
    primaryGreen,
    primaryBtnBg,
    primaryBtnText,
    primaryBtnHover,
    textMain,
    textMuted,
    borderSubtle,
    borderStrong,
    elevatedShadow,
  } = useCupiTokens()

  return (
    <Box
      as="header"
      pos="fixed"
      top={0}
      left={0}
      w="100%"
      zIndex={100}
      pt={{ base: 3, sm: 4 }}
      px={{ base: 3, sm: 5 }}
      pointerEvents="none"
    >
      <Flex
        as="nav"
        aria-label="Navigasi Utama CuPI"
        data-cupi-el="true"
        maxW="720px"
        minH="54px"
        mx="auto"
        px={{ base: 3.5, sm: 5 }}
        py={{ base: 1.5, sm: 0 }}
        align="center"
        justify="space-between"
        gap={2}
        bg={surfaceSage}
        borderRadius="full"
        border="1px solid"
        borderColor={borderSubtle}
        boxShadow={elevatedShadow}
        pointerEvents="auto"
        animation="dropUnblur 0.55s cubic-bezier(0.16, 1, 0.3, 1) both"
      >
        {/* Wordmark CuPI */}
        <HStack
          as="button"
          type="button"
          spacing={2}
          onClick={() => setActiveNav('CuPI')}
          pl={1}
          cursor="pointer"
          userSelect="none"
          animation="contentReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both"
          _focusVisible={{
            outline: '2px solid',
            outlineColor: primaryGreen,
            outlineOffset: '3px',
            borderRadius: 'full',
          }}
        >
          <Box w="8px" h="8px" borderRadius="full" bg={primaryGreen} />
          <Text
            fontFamily="'Figtree', sans-serif"
            fontWeight="extrabold"
            fontSize={{ base: 'sm', sm: 'md' }}
            letterSpacing="0.02em"
            color={textMain}
          >
            CuPI
          </Text>
        </HStack>

        {/* Tiga Item Navigasi: CuPI | History Track | Profile */}
        <HStack
          spacing={{ base: 0.5, sm: 1.5 }}
          animation="contentReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item
            return (
              <Box
                as="button"
                type="button"
                key={item}
                onClick={() => setActiveNav(item)}
                aria-current={isActive ? 'page' : undefined}
                px={{ base: 2.5, sm: 3.5 }}
                py={1.5}
                borderRadius="full"
                fontSize={{ base: 'xs', sm: 'sm' }}
                fontWeight={isActive ? 'bold' : 'medium'}
                color={isActive ? primaryBtnText : textMuted}
                bg={isActive ? primaryBtnBg : 'transparent'}
                cursor="pointer"
                userSelect="none"
                whiteSpace="nowrap"
                transition="background-color 0.2s ease, color 0.2s ease, transform 0.15s ease"
                _hover={{
                  bg: isActive ? primaryBtnHover : surfaceInteractive,
                  color: isActive ? primaryBtnText : textMain,
                }}
                _active={{ transform: 'scale(0.96)' }}
                _focusVisible={{
                  outline: '2px solid',
                  outlineColor: primaryGreen,
                  outlineOffset: '1px',
                }}
              >
                {item}
              </Box>
            )
          })}
        </HStack>

        {/* Tombol Toggle Mode Terang / Gelap */}
        <HStack
          spacing={2}
          animation="contentReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both"
        >
          <Box
            as="button"
            type="button"
            onClick={toggleColorMode}
            aria-label={
              colorMode === 'dark'
                ? 'Beralih ke mode terang'
                : 'Beralih ke mode gelap'
            }
            w="34px"
            h="34px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
            bg={surfaceCream}
            color={textMain}
            border="1px solid"
            borderColor={borderSubtle}
            cursor="pointer"
            userSelect="none"
            _hover={{
              borderColor: borderStrong,
              bg: surfaceInteractive,
              transform: 'scale(1.06)',
            }}
            _active={{ transform: 'scale(0.9)' }}
            _focusVisible={{
              outline: '2px solid',
              outlineColor: primaryGreen,
              outlineOffset: '2px',
            }}
          >
            <Box
              as="span"
              key={colorMode}
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              animation="iconSwitch 0.36s cubic-bezier(0.22, 1, 0.36, 1) both"
            >
              {colorMode === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </Box>
          </Box>
        </HStack>
      </Flex>
    </Box>
  )
}

export default Navbar
