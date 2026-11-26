import { Box, Button, Collapse, Text, VStack } from '@chakra-ui/react'
import { CircleCheck, CircleHelp, TriangleAlert } from 'lucide-react'
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
        title="Cium dan lihat sebentar. Ada yang aneh?"
        subtitle="Bau asam, lendir, jamur, atau wadah menggembung."
      />

      <VStack align="stretch" spacing={2.5}>
        <OptionCard
          icon={CircleCheck}
          title="Semuanya normal"
          description="Bau, warna, dan teksturnya biasa"
          selected={answers.sensory === 'normal'}
          onClick={() => advance({ sensory: 'normal', sensoryFlags: [] })}
        />
        <OptionCard
          icon={TriangleAlert}
          tone="danger"
          title="Ada yang aneh"
          description="Pilih tanda yang kamu temukan"
          selected={showFlags}
          onClick={() => update({ sensory: 'flags' })}
        />

        <Collapse in={showFlags} animateOpacity>
          <Box pl={{ base: 0, sm: 4 }} pt={1} pb={2}>
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
                Lihat hasil
              </Button>
            ) : (
              <Text fontSize="sm" color="fg.muted" mt={3}>
                Pilih minimal satu tanda.
              </Text>
            )}
          </Box>
        </Collapse>

        <OptionCard
          icon={CircleHelp}
          title="Belum dicek"
          description="Boleh lanjut, tapi hasilnya akan lebih hati-hati"
          selected={answers.sensory === 'unchecked'}
          onClick={() => advance({ sensory: 'unchecked', sensoryFlags: [] })}
        />
      </VStack>
    </Box>
  )
}

export default StepSensory
