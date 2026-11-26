import { Box, Flex, HStack, SimpleGrid, Text, useColorMode } from '@chakra-ui/react'
import { NAV_ITEMS } from '../../constants/navigation'
import GlobalStyles from '../../theme/GlobalStyles'

const count = (n) => (n > 0 ? ` (${n})` : '')

// Kerangka aplikasi: kop di atas, navigasi bawah di HP, navigasi atas di layar lebar.
function AppShell({ activeNav, onNavigate, badges = {}, children }) {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex direction="column" minH="100dvh">
      <GlobalStyles />

      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={20}
        bg="bg.canvas"
        borderBottom="1.5px solid"
        borderColor="border"
      >
        <Flex maxW="960px" mx="auto" px={4} h="58px" align="center" justify="space-between" gap={4}>
          <HStack
            as="button"
            type="button"
            onClick={() => onNavigate('home')}
            spacing={2.5}
            align="baseline"
            aria-label="CuPI, ke beranda"
          >
            <Text fontFamily="heading" fontWeight={700} fontSize="2xl" lineHeight="1" letterSpacing="-0.03em">
              CuPI
            </Text>
            <Text textStyle="mono" fontSize="10px" color="fg.muted" display={{ base: 'none', sm: 'block' }}>
              cek makanan sisa
            </Text>
          </HStack>

          <HStack as="nav" aria-label="Navigasi utama" spacing={5} display={{ base: 'none', md: 'flex' }}>
            {NAV_ITEMS.map((item) => {
              const active = activeNav === item.id
              return (
                <Box
                  as="button"
                  type="button"
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  aria-current={active ? 'page' : undefined}
                  textStyle="mono"
                  py={1}
                  color={active ? 'fg' : 'fg.muted'}
                  borderBottom="2px solid"
                  borderColor={active ? 'fg' : 'transparent'}
                  _hover={{ color: 'fg' }}
                >
                  {item.label}
                  {count(badges[item.id])}
                </Box>
              )
            })}
          </HStack>

          <Box
            as="button"
            type="button"
            onClick={toggleColorMode}
            textStyle="mono"
            fontSize="10px"
            color="fg.muted"
            _hover={{ color: 'fg' }}
          >
            {colorMode === 'dark' ? 'Mode terang' : 'Mode gelap'}
          </Box>
        </Flex>
      </Box>

      <Box
        as="main"
        key={activeNav}
        flex="1"
        w="100%"
        maxW="640px"
        mx="auto"
        px={4}
        pt={{ base: 6, md: 10 }}
        pb={{ base: 'calc(100px + env(safe-area-inset-bottom))', md: 16 }}
        animation="fadeUp 0.28s ease-out both"
      >
        {children}
      </Box>

      {/* Navigasi bawah, khusus HP */}
      <Box
        as="nav"
        aria-label="Navigasi utama"
        display={{ base: 'block', md: 'none' }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={20}
        bg="bg.canvas"
        borderTop="1.5px solid"
        borderColor="border"
        pb="env(safe-area-inset-bottom)"
      >
        <SimpleGrid columns={NAV_ITEMS.length}>
          {NAV_ITEMS.map((item, index) => {
            const active = activeNav === item.id
            const Icon = item.icon
            return (
              <Flex
                as="button"
                type="button"
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-current={active ? 'page' : undefined}
                direction="column"
                align="center"
                justify="center"
                gap={1}
                pt={2.5}
                pb={2}
                position="relative"
                color={active ? 'fg' : 'fg.subtle'}
                bg={active ? 'bg.surface' : 'transparent'}
                borderLeft={index === 0 ? 'none' : '1px solid'}
                borderColor="border.soft"
              >
                {active && <Box position="absolute" top="-1.5px" left={0} right={0} h="3px" bg="fg" />}
                <Icon size={19} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
                <Text fontFamily="mono" fontSize="10px" fontWeight={active ? 600 : 500} letterSpacing="0.06em" textTransform="uppercase">
                  {item.short}
                  {count(badges[item.id])}
                </Text>
              </Flex>
            )
          })}
        </SimpleGrid>
      </Box>
    </Flex>
  )
}

export default AppShell
