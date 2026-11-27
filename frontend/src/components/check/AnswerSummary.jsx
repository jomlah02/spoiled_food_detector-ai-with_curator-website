import { Box, Flex, Text } from '@chakra-ui/react'
import { getPreRoom, getStorage } from '../../constants/food'
import { CHECK_STEPS, isStepAnswered } from '../../hooks/useCheckWizard'
import { formatAgo } from '../../lib/time'

const SENSORY_LABELS = {
  normal: 'bau normal',
  unchecked: 'belum dicium',
  flags: 'ada yang aneh',
}

function labelFor(step, answers, now) {
  switch (step) {
    case 'food':
      return answers.foodName.trim() || (answers.imagePreview ? 'foto makanan' : '')
    case 'sensory':
      return SENSORY_LABELS[answers.sensory]
    case 'time':
      return answers.cookedChoice === 'given'
        ? 'pemberian'
        : `masak ${formatAgo(answers.cookedAt, now)}`
    case 'storage': {
      const pre = getPreRoom(answers.preRoom)
      const storage = getStorage(answers.storageId).label.toLowerCase()
      return pre ? `${storage}, ${pre.label.toLowerCase()} di luar` : storage
    }
    default:
      return ''
  }
}

function AnswerSummary({ answers, currentStep, onEdit, now }) {
  const items = CHECK_STEPS.map((step, index) => ({ step, index })).filter(
    ({ step, index }) => index !== currentStep && isStepAnswered(step, answers)
  )

  if (items.length === 0) return null

  return (
    <Flex wrap="wrap" columnGap={2} rowGap={1} align="baseline" fontFamily="mono" fontSize="12px">
      {items.map(({ step, index }, i) => (
        <Flex key={step} align="baseline" gap={2}>
          {i > 0 && <Text as="span" color="fg.subtle" aria-hidden="true">/</Text>}
          <Box
            as="button"
            type="button"
            onClick={() => onEdit(index)}
            color="fg.muted"
            textDecoration="underline"
            textDecorationStyle="dotted"
            textUnderlineOffset="3px"
            _hover={{ color: 'fg', textDecorationStyle: 'solid' }}
            title="Ketuk untuk mengubah"
          >
            {labelFor(step, answers, now)}
          </Box>
        </Flex>
      ))}
    </Flex>
  )
}

export default AnswerSummary
