import { Box, Button, Collapse, Text, VStack } from '@chakra-ui/react'
import { SENSORY_CHECKS } from '../../constants/food'
import OptionCard from '../ui/OptionCard'
import StepHeader from './StepHeader'

// Gerbang tanda bahaya: kalau ada, langsung ke hasil tanpa pertanyaan lain.
function StepSensory({ answers, update, advance, finish }) {
  const showFlags = answers.sensory === 'flags'

  const toggleFlag = (id) => {
    const flags = answers.sensoryFlags.includes(id)
      ? answers.sensoryFlags.filter((f) => f !== id)
      : [...answers.sensoryFlags, id]
    update({ sensoryFlags: flags })
  }

  return (
    <Box>
      <StepHeader
        title="Cium dulu. Ada yang aneh?"
        subtitle="Bau asam, berlendir, ada jamur, atau wadahnya menggembung."
      />

      <VStack align="stretch" spacing={2}>
        <OptionCard
          title="Normal semua"
          description="Bau, warna, dan teksturnya biasa saja"
          selected={answers.sensory === 'normal'}
          onClick={() => advance({ sensory: 'normal', sensoryFlags: [] })}
        />
        <OptionCard
          tone="danger"
          title="Ada yang aneh"
          description="Tandai apa saja yang kamu temukan"
          selected={showFlags}
          onClick={() => update({ sensory: 'flags' })}
        />

        <Collapse in={showFlags} animateOpacity>
          <Box ml={{ base: 3, sm: 7 }} pl={4} py={2} borderLeft="1.5px dashed" borderColor="status.danger" borderRadius={0}>
            <VStack align="stretch" spacing={2}>
              {SENSORY_CHECKS.map((check) => (
                <OptionCard
                  key={check.id}
                  tone="danger"
                  title={check.label}
                  selected={answers.sensoryFlags.includes(check.id)}
                  onClick={() => toggleFlag(check.id)}
                />
              ))}
            </VStack>
            {answers.sensoryFlags.length > 0 ? (
              <Button variant="danger" size="lg" w="100%" mt={4} onClick={finish}>
                Lihat hasil →
              </Button>
            ) : (
              <Text fontSize="sm" color="fg.muted" mt={3}>
                Tandai minimal satu.
              </Text>
            )}
          </Box>
        </Collapse>

        <OptionCard
          title="Belum dicium"
          description="Boleh lanjut, tapi hasilnya jadi lebih hati-hati"
          selected={answers.sensory === 'unchecked'}
          onClick={() => advance({ sensory: 'unchecked', sensoryFlags: [] })}
        />
      </VStack>
    </Box>
  )
}

export default StepSensory
