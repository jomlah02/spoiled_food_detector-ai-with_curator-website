import { useState } from 'react'
import { Box, Button, Collapse, Input, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { formatAgo, getCookedTimeOptions, HOUR, toLocalInputValue } from '../../lib/time'
import Chip from '../ui/Chip'
import OptionCard from '../ui/OptionCard'
import StepHeader from './StepHeader'

const MAX_AGE_HOURS = 24 * 120

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
      setError('Waktunya belum terjadi. Cek lagi tanggalnya.')
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
        subtitle="Kira-kira saja, sudah dibedakan berdasarkan cakupan."
      />

      <SimpleGrid columns={2} spacing={2}>
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

      <VStack align="stretch" spacing={2} mt={5}>
        <OptionCard
          title="Tahu jam pastinya"
          description="Pilih tanggal dan jam"
          selected={showCustom}
          onClick={() => setShowCustom(true)}
        />
        <Collapse in={showCustom} animateOpacity>
          <Box pt={1} pb={2}>
            <Input
              type="datetime-local"
              size="lg"
              fontFamily="mono"
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
            <Button variant="primary" size="lg" w="100%" mt={3} onClick={handleCustomContinue}>
              Lanjut →
            </Button>
          </Box>
        </Collapse>
        <OptionCard
          title="Pemberian"
          description="Misalnya dari acara, atau dikasih orang"
          selected={answers.cookedChoice === 'given'}
          onClick={() => {
            setShowCustom(false)
            advance({ cookedAt: null, cookedChoice: 'given' })
          }}
        />
      </VStack>
    </Box>
  )
}

export default StepTime
