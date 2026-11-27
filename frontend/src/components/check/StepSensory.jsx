import { Box, Button, Collapse, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { SENSORY_CHECKS } from '../../constants/food'
import { getAnalysisView } from '../../lib/api'
import Label from '../ui/Label'
import OptionCard from '../ui/OptionCard'
import Stamp from '../ui/Stamp'
import StepHeader from './StepHeader'

function StepSensory({ answers, update, finish, analysis, analysisNotice }) {
  const showFlags = answers.sensory === 'flags'
  const view = getAnalysisView(analysis, answers.foodName)

  const toggleFlag = (id) => {
    const flags = answers.sensoryFlags.includes(id)
      ? answers.sensoryFlags.filter((f) => f !== id)
      : [...answers.sensoryFlags, id]
    update({ sensoryFlags: flags })
  }

  return (
    <Box>
      <Label tape mb={6}>
        <Flex justify="space-between" align="start" gap={4}>
          <Text textStyle="mono" color="fg.muted" pt={1}>
            {view.foodName || 'Hasil analisa awal'}
          </Text>
          {view.status && <Stamp status={view.status} />}
        </Flex>
        <Heading as="h2" fontSize={{ base: '22px', sm: '26px' }} lineHeight="1.15" mt={3}>
          {view.headline}
        </Heading>
        {view.summary && (
          <Text mt={3} color="fg.muted">
            {view.summary}
          </Text>
        )}
        {analysisNotice && (
          <Text mt={3} fontSize="xs" color="fg.subtle">
            {analysisNotice}
          </Text>
        )}
      </Label>

      <StepHeader
        title="Cium dulu. Ada yang aneh?"
        subtitle="Bau asam, berlendir, ada jamur, atau wadahnya menggembung."
      />

      <VStack align="stretch" spacing={2}>
        <OptionCard
          title="Normal semua"
          description="Bau, warna, dan teksturnya biasa saja"
          selected={answers.sensory === 'normal'}
          onClick={() => finish({ sensory: 'normal', sensoryFlags: [] })}
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
          onClick={() => finish({ sensory: 'unchecked', sensoryFlags: [] })}
        />
      </VStack>
    </Box>
  )
}

export default StepSensory
