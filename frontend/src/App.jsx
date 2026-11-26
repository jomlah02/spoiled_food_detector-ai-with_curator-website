import { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CheckerPage from './pages/CheckerPage'
import HistoryPage from './pages/HistoryPage'
import ProfilePage from './pages/ProfilePage'
import GlobalStyles from './theme/GlobalStyles'
import { useCupiTokens } from './theme/useCupiTokens'
import { useFoodCheck } from './hooks/useFoodCheck'
import { useHistory } from './hooks/useHistory'
import { useProfile } from './hooks/useProfile'

function App() {
  const [activeNav, setActiveNav] = useState('CuPI')
  const { bgMain, textMain } = useCupiTokens()

  // State disimpan di sini (bukan di tiap halaman) agar tidak hilang saat berpindah menu
  const profileState = useProfile()
  const history = useHistory()
  const check = useFoodCheck({
    profile: profileState.profile,
    onRecordSaved: history.addRecord,
  })

  return (
    <Flex
      direction="column"
      minH="100vh"
      w="100%"
      bg={bgMain}
      color={textMain}
      fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      className="cupi-root-transition"
    >
      <GlobalStyles />

      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />

      <Flex
        as="main"
        flex="1"
        direction="column"
        align="center"
        w="100%"
        pt={{ base: '92px', sm: '104px' }}
        pb={{ base: '48px', md: '64px' }}
        px={{ base: 4, sm: 6 }}
      >
        <Box
          key={activeNav}
          w="100%"
          maxW="880px"
          animation="pageFadeUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) both"
        >
          {activeNav === 'CuPI' && (
            <CheckerPage
              check={check}
              profile={profileState.profile}
              setActiveNav={setActiveNav}
            />
          )}

          {activeNav === 'History Track' && (
            <HistoryPage history={history} setActiveNav={setActiveNav} />
          )}

          {activeNav === 'Profile' && (
            <ProfilePage profileState={profileState} history={history} />
          )}
        </Box>
      </Flex>

      <Footer />
    </Flex>
  )
}

export default App
