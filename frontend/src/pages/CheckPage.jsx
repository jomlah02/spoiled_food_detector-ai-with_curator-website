import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import AnswerSummary from '../components/check/AnswerSummary'
import CheckResult from '../components/check/CheckResult'
import StepDynamic from '../components/check/StepDynamic'
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

  // Sesi 1 tetap 01/04. Setelah analisa, bar bertambah sesuai jumlah
  // pertanyaan lanjutan AI + satu langkah cek bau/tampilan.
  const steps = wizard.isForm
    ? CHECK_STEPS
    : [
        ...CHECK_STEPS,
        ...wizard.questions.map((question, index) => `dynamic-${question.id || index}`),
        'sensory',
      ]
  const total = steps.length
  const current = wizard.currentStepIndex
  const StepComponent = wizard.isDynamic
    ? StepDynamic
    : wizard.isSensory
      ? StepSensory
      : STEP_COMPONENTS[wizard.stepName]

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Flex align="center" justify="space-between" mb={3} minH="20px">
          {wizard.step > 0 || wizard.isDynamic || wizard.isSensory ? (
            <TextButton onClick={wizard.back}>← Kembali</TextButton>
          ) : (
            <Text textStyle="mono" color="fg.muted">
              {wizard.isRecheck ? 'Cek ulang' : 'Cek baru'}
            </Text>
          )}
          <HStack spacing={4}>
            {wizard.hasProgress && <TextButton onClick={onNewCheck}>Ulang dari awal</TextButton>}
            <Text fontFamily="mono" fontSize="xs" color="fg">
              {pad(current + 1)}/{pad(total)}
            </Text>
          </HStack>
        </Flex>
        <HStack spacing={1} aria-label={`Langkah ${current + 1} dari ${total}`} role="img">
          {steps.map((step, index) => (
            <Box
              key={step}
              flex="1"
              h="4px"
              bg={index <= current ? 'fg' : 'border.soft'}
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

      <Box key={`${wizard.phase}-${current}`} animation="stepIn 0.26s ease-out both">
        <StepComponent
          answers={wizard.answers}
          update={wizard.update}
          next={wizard.next}
          advance={wizard.advance}
          submit={wizard.submit}
          submitting={wizard.submitting}
          submitError={wizard.submitError}
          finish={wizard.finish}
          analysis={wizard.analysis}
          analysisNotice={wizard.analysisNotice}
          now={now}
          question={wizard.dynamicQuestion}
          index={wizard.dynamicIndex}
          total={wizard.questions.length}
          answer={wizard.dynamicQuestion ? wizard.answers.followUps[wizard.dynamicQuestion.id] : undefined}
          onAnswer={(value) => wizard.dynamicQuestion && wizard.setFollowUp(wizard.dynamicQuestion.id, value)}
          onAdvance={wizard.advanceDynamic}
        />
      </Box>
    </VStack>
  )
}

export default CheckPage
