import { Box, Button, Flex, HStack, Progress, Text, VStack } from '@chakra-ui/react'
import { ChevronLeft, RotateCcw } from 'lucide-react'
import AnswerSummary from '../components/check/AnswerSummary'
import CheckResult from '../components/check/CheckResult'
import StepExtras from '../components/check/StepExtras'
import StepFood from '../components/check/StepFood'
import StepSensory from '../components/check/StepSensory'
import StepStorage from '../components/check/StepStorage'
import StepTime from '../components/check/StepTime'
import { CHECK_STEPS } from '../hooks/useCheckWizard'
import { useNow } from '../hooks/useNow'

const STEP_COMPONENTS = {
  food: StepFood,
  sensory: StepSensory,
  time: StepTime,
  storage: StepStorage,
  extras: StepExtras,
}

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
    <VStack align="stretch" spacing={5}>
      <Flex align="center" justify="space-between" minH="32px">
        {wizard.step > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            ml={-2}
            leftIcon={<ChevronLeft size={18} />}
            onClick={wizard.back}
          >
            Kembali
          </Button>
        ) : (
          <Text fontSize="sm" fontWeight="semibold" color="brand">
            {wizard.isRecheck ? 'Cek ulang' : 'Cek makanan'}
          </Text>
        )}
        {wizard.hasProgress && (
          <Button
            variant="ghost"
            size="sm"
            mr={-2}
            leftIcon={<RotateCcw size={15} />}
            onClick={onNewCheck}
          >
            Mulai ulang
          </Button>
        )}
      </Flex>

      <Box>
        <HStack justify="space-between" fontSize="xs" color="fg.muted" mb={2}>
          <Text fontWeight="semibold">
            Langkah {wizard.step + 1} dari {total}
          </Text>
          <Text>± 30 detik</Text>
        </HStack>
        <Progress
          value={((wizard.step + 1) / total) * 100}
          size="sm"
          borderRadius="full"
          bg="bg.muted"
          sx={{ '& > div': { bg: 'brand', transition: 'width 0.3s ease' } }}
          aria-label="Progres pemeriksaan"
        />
      </Box>

      <AnswerSummary
        answers={wizard.answers}
        currentStep={wizard.step}
        onEdit={wizard.goTo}
        now={now}
      />

      <Box key={wizard.step} animation="stepIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) both">
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
