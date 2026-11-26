import { Flex, HStack, Text } from '@chakra-ui/react'
import { Pencil } from 'lucide-react'
import { getPreRoom, getStorage } from '../../constants/food'
import { CHECK_STEPS, isStepAnswered } from '../../hooks/useCheckWizard'
import { formatAgo } from '../../lib/time'

const SENSORY_LABELS = {
  normal: 'Bau & tampilan normal',
  unchecked: 'Belum dicek',
  flags: 'Ada tanda aneh',
}

function labelFor(step, answers, now) {
  switch (step) {
    case 'food':
      return answers.foodName.trim()
    case 'sensory':
      return SENSORY_LABELS[answers.sensory]
    case 'time':
      return answers.cookedChoice === 'unknown'
        ? 'Waktu tidak diketahui'
        : `Dimasak ${formatAgo(answers.cookedAt, now)}`
    case 'storage': {
      const pre = getPreRoom(answers.preRoom)
      const storage = getStorage(answers.storageId).label
      return pre ? `${storage}, sebelumnya ${pre.label.toLowerCase()} di luar` : storage
    }
    default:
      return ''
  }
}

// Jawaban yang sudah terisi tampil sebagai pil kecil. Ketuk untuk mengubah.
function AnswerSummary({ answers, currentStep, onEdit, now }) {
  const items = CHECK_STEPS.map((step, index) => ({ step, index })).filter(
    ({ step, index }) => index !== currentStep && isStepAnswered(step, answers)
  )

  if (items.length === 0) return null

  return (
    <Flex wrap="wrap" gap={2}>
      {items.map(({ step, index }) => (
        <HStack
          as="button"
          type="button"
          key={step}
          onClick={() => onEdit(index)}
          spacing={1.5}
          px={3}
          py={1}
          borderRadius="full"
          bg="bg.muted"
          color="fg.muted"
          fontSize="xs"
          fontWeight="semibold"
          _hover={{ color: 'fg' }}
          aria-label={`Ubah: ${labelFor(step, answers, now)}`}
        >
          <Text as="span" noOfLines={1} maxW="220px">
            {labelFor(step, answers, now)}
          </Text>
          <Pencil size={11} aria-hidden="true" />
        </HStack>
      ))}
    </Flex>
  )
}

export default AnswerSummary
