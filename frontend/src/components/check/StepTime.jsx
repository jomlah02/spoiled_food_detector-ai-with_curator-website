import { useState } from 'react'
import { Box, Button, Collapse, Input, SimpleGrid, Text } from '@chakra-ui/react'
import { ArrowRight, CalendarClock, CircleHelp } from 'lucide-react'
import { formatAgo, getCookedTimeOptions, HOUR, toLocalInputValue } from '../../lib/time'
import Chip from '../ui/Chip'
import OptionCard from '../ui/OptionCard'
import StepHeader from './StepHeader'

const MAX_AGE_HOURS = 24 * 120

// Ditanya jam masak, bukan "berapa jam". CuPI yang menghitung durasinya.
function StepTime({ answers, update, advance, next, now }) {
  const [showCustom, setShowCustom] = useState(answers.cookedChoice === 'custom')
  const [error, setError] = useState('')
  const options = getCookedTimeOptions(now)

  const handleCustomChange = (value) => {
    setError('')
    const ms = new Date(value).getTime()
    if (!Number.isFinite(ms)) return
    update({ cookedAt: ms, cookedChoice: 'custom' })
  }

  const handleCustomContinue = () => {
    const ms = answers.cookedAt
    if (answers.cookedChoice !== 'custom' || !Number.isFinite(ms)) {
      setError('Pilih tanggal dan jamnya dulu.')
      return
    }
    if (ms > now) {
      setError('Waktunya tidak boleh di masa depan.')
      return
    }
    if ((now - ms) / HOUR > MAX_AGE_HOURS) {
      setError('Lebih dari 4 bulan lalu? Sebaiknya jangan dimakan.')
      return
    }
    next()
  }

  return (
    <Box>
      <StepHeader
        title="Kapan dimasak atau dibeli?"
        subtitle="Kira-kira saja. CuPI yang menghitung sudah berapa lama."
      />

      <SimpleGrid columns={2} spacing={2.5}>
        {options.map((option) => (
          <Chip
            key={option.id}
            sub={formatAgo(option.value, now)}
            selected={answers.cookedChoice === option.id}
            onClick={() => {
              setShowCustom(false)
              advance({ cookedAt: option.value, cookedChoice: option.id })
            }}
            py={3}
          >
            {option.label}
          </Chip>
        ))}
      </SimpleGrid>

      <Box mt={3}>
        <OptionCard
          icon={CalendarClock}
          title="Pilih tanggal dan jam"
          description="Kalau kamu tahu waktu pastinya"
          selected={showCustom}
          onClick={() => setShowCustom(true)}
        />
        <Collapse in={showCustom} animateOpacity>
          <Box pt={3}>
            <Input
              type="datetime-local"
              size="lg"
              max={toLocalInputValue(now)}
              value={
                answers.cookedChoice === 'custom' && answers.cookedAt
                  ? toLocalInputValue(answers.cookedAt)
                  : ''
              }
              onChange={(e) => handleCustomChange(e.target.value)}
              aria-label="Tanggal dan jam dimasak"
            />
            {error && (
              <Text fontSize="sm" color="status.danger" mt={2}>
                {error}
              </Text>
            )}
            <Button
              variant="primary"
              size="lg"
              w="100%"
              mt={3}
              rightIcon={<ArrowRight size={18} />}
              onClick={handleCustomContinue}
            >
              Lanjut
            </Button>
          </Box>
        </Collapse>
      </Box>

      <Box mt={2.5}>
        <OptionCard
          icon={CircleHelp}
          title="Tidak tahu"
          description="Misalnya makanan dari acara atau pemberian orang"
          selected={answers.cookedChoice === 'unknown'}
          onClick={() => {
            setShowCustom(false)
            advance({ cookedAt: null, cookedChoice: 'unknown' })
          }}
        />
      </Box>
    </Box>
  )
}

export default StepTime
