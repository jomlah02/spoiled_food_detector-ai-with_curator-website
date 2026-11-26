import { Box, Flex, HStack, IconButton, SimpleGrid, Text, useColorMode } from '@chakra-ui/react'
import { Leaf, Moon, Sun } from 'lucide-react'
import { NAV_ITEMS } from '../../constants/navigation'
import GlobalStyles from '../../theme/GlobalStyles'

// Kerangka aplikasi: header di atas, navigasi bawah di HP, navigasi atas di layar lebar.
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
        borderBottom="1px solid"
        borderColor="border"
      >
        <Flex maxW="960px" mx="auto" px={4} h="60px" align="center" justify="space-between" gap={4}>
          <HStack
            as="button"
            type="button"
            onClick={() => onNavigate('home')}
            spacing={2}
            aria-label="CuPI, ke beranda"
          >
            <Flex w="32px" h="32px" borderRadius="lg" bg="brand" color="brand.fg" align="center" justify="center">
              <Leaf size={18} aria-hidden="true" />
            </Flex>
            <Text fontFamily="heading" fontWeight="extrabold" fontSize="lg" color="fg">
              CuPI
            </Text>
          </HStack>

          <HStack as="nav" aria-label="Navigasi utama" spacing={1} display={{ base: 'none', md: 'flex' }}>
            {NAV_ITEMS.map((item) => {
              const active = activeNav === item.id
              return (
                <Box
                  as="button"
                  type="button"
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  aria-current={active ? 'page' : undefined}
                  px={3.5}
                  py={2}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="semibold"
                  bg={active ? 'brand.subtle' : 'transparent'}
                  color={active ? 'brand.subtleFg' : 'fg.muted'}
                  _hover={{ bg: active ? 'brand.subtle' : 'bg.muted', color: active ? 'brand.subtleFg' : 'fg' }}
                >
                  {item.label}
                  {badges[item.id] > 0 && (
                    <Box as="span" ml={1.5} px={1.5} borderRadius="full" bg="brand" color="brand.fg" fontSize="xs">
                      {badges[item.id]}
                    </Box>
                  )}
                </Box>
              )
            })}
          </HStack>

          <IconButton
            variant="ghost"
            borderRadius="full"
            onClick={toggleColorMode}
            aria-label={colorMode === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
            icon={colorMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          />
        </Flex>
      </Box>

      <Box
        as="main"
        key={activeNav}
        flex="1"
        w="100%"
        maxW="680px"
        mx="auto"
        px={4}
        pt={{ base: 5, md: 8 }}
        pb={{ base: 'calc(96px + env(safe-area-inset-bottom))', md: 16 }}
        animation="fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both"
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
        bg="bg.surface"
        borderTop="1px solid"
        borderColor="border"
        pb="env(safe-area-inset-bottom)"
      >
        <SimpleGrid columns={NAV_ITEMS.length}>
          {NAV_ITEMS.map((item) => {
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
                py={2.5}
                color={active ? 'brand' : 'fg.muted'}
                position="relative"
              >
                <Box
                  px={4}
                  py={1}
                  borderRadius="full"
                  bg={active ? 'brand.subtle' : 'transparent'}
                  position="relative"
                >
                  <Icon size={20} strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
                  {badges[item.id] > 0 && (
                    <Box
                      position="absolute"
                      top="-2px"
                      right="6px"
                      minW="16px"
                      h="16px"
                      px={1}
                      borderRadius="full"
                      bg="brand"
                      color="brand.fg"
                      fontSize="10px"
                      fontWeight="bold"
                      lineHeight="16px"
                    >
                      {badges[item.id]}
                    </Box>
                  )}
                </Box>
                <Text fontSize="11px" fontWeight={active ? 'bold' : 'medium'}>
                  {item.label}
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
