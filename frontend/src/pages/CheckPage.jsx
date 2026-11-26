import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import AnswerSummary from '../components/check/AnswerSummary'
import CheckResult from '../components/check/CheckResult'
import StepExtras from '../components/check/StepExtras'
import StepFood from '../components/check/StepFood'
import StepSensory from '../components/check/StepSensory'
import StepStorage from '../components/check/StepStorage'
import StepTime from '../components/check/StepTime'
import TextButton from '../components/ui/TextButton'
import { CHECK_STEPS } from '../hooks/useCheckWizard'
import { useNow } from '../hooks/useNow'

const STEP_COMPONENTS = {
  food: StepFood,
  sensory: StepSensory,
  time: StepTime,
  storage: StepStorage,
  extras: StepExtras,
}

const pad = (n) => String(n).padStart(2, '0')

function CheckPage({ wizard, profile, onNewCheck, onNavigate }) {
  const now = useNow()

  if (wizard.isResult && wizard.result) {
    return (
      <CheckResult
        record={wizard.result}
        now={now}
        showWasteGuidance={profile.showWasteGuidance}
        onNewCheck={onNewCheck}
        onOpenKulkas={() => onNavigate('kulkas')}
      />
    )
  }

  const total = CHECK_STEPS.length
  const StepComponent = STEP_COMPONENTS[wizard.stepName]

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Flex align="center" justify="space-between" mb={3} minH="20px">
          {wizard.step > 0 ? (
            <TextButton onClick={wizard.back}>← Kembali</TextButton>
          ) : (
            <Text textStyle="mono" color="fg.muted">
              {wizard.isRecheck ? 'Cek ulang' : 'Cek baru'}
            </Text>
          )}
          <HStack spacing={4}>
            {wizard.hasProgress && <TextButton onClick={onNewCheck}>Ulang dari awal</TextButton>}
            <Text fontFamily="mono" fontSize="xs" color="fg">
              {pad(wizard.step + 1)}/{pad(total)}
            </Text>
          </HStack>
        </Flex>
        <HStack spacing={1} aria-label={`Langkah ${wizard.step + 1} dari ${total}`} role="img">
          {CHECK_STEPS.map((step, index) => (
            <Box
              key={step}
              flex="1"
              h="4px"
              bg={index <= wizard.step ? 'fg' : 'border.soft'}
              transition="background-color 0.25s ease"
            />
          ))}
        </HStack>
      </Box>

      <AnswerSummary
        answers={wizard.answers}
        currentStep={wizard.step}
        onEdit={wizard.goTo}
        now={now}
      />

      <Box key={wizard.step} animation="stepIn 0.26s ease-out both">
        <StepComponent
          answers={wizard.answers}
          update={wizard.update}
          next={wizard.next}
          advance={wizard.advance}
          finish={wizard.finish}
          now={now}
        />
      </Box>
    </VStack>
  )
}

export default CheckPage
