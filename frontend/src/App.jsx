import { useState } from 'react'
import AppShell from './components/layout/AppShell'
import HomePage from './pages/HomePage'
import CheckPage from './pages/CheckPage'
import KulkasPage from './pages/KulkasPage'
import ProfilePage from './pages/ProfilePage'
import { useCheckWizard } from './hooks/useCheckWizard'
import { useKulkas } from './hooks/useKulkas'
import { useProfile } from './hooks/useProfile'

function App() {
  const [activeNav, setActiveNav] = useState('home')

  // State disimpan di sini (bukan di tiap halaman) agar tidak hilang saat pindah menu
  const { profile, updateProfile } = useProfile()
  const kulkas = useKulkas()
  const wizard = useCheckWizard({ profile, onSave: kulkas.saveItem })

  const navigate = (id) => {
    // Menu "Cek" setelah melihat hasil = mulai cek baru
    if (id === 'check' && wizard.isResult) wizard.reset()
    setActiveNav(id)
    window.scrollTo({ top: 0 })
  }

  const startNewCheck = () => {
    wizard.reset()
    setActiveNav('check')
    window.scrollTo({ top: 0 })
  }

  const recheck = (item) => {
    wizard.startRecheck(item)
    setActiveNav('check')
    window.scrollTo({ top: 0 })
  }

  return (
    <AppShell
      activeNav={activeNav}
      onNavigate={navigate}
      badges={{ kulkas: kulkas.active.length }}
    >
      {activeNav === 'home' && (
        <HomePage
          profile={profile}
          kulkas={kulkas}
          wizardInProgress={wizard.hasProgress && !wizard.isResult}
          onNewCheck={startNewCheck}
          onContinueCheck={() => navigate('check')}
          onNavigate={navigate}
        />
      )}

      {activeNav === 'check' && (
        <CheckPage
          wizard={wizard}
          profile={profile}
          onNewCheck={startNewCheck}
          onNavigate={navigate}
        />
      )}

      {activeNav === 'kulkas' && (
        <KulkasPage kulkas={kulkas} onNewCheck={startNewCheck} onRecheck={recheck} />
      )}

      {activeNav === 'profile' && (
        <ProfilePage profile={profile} updateProfile={updateProfile} kulkas={kulkas} />
      )}
    </AppShell>
  )
}

export default App
