import { Box, Button, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import OptionCard from '../ui/OptionCard'
import StepHeader from './StepHeader'

const selectedIds = (answer) => {
  if (Array.isArray(answer)) return answer.map((item) => (typeof item === 'object' ? item.id : item))
  return []
}

function StepDynamic({ question, answer, index, total, onAnswer, onAdvance }) {
  if (!question) return null

  const options = Array.isArray(question.options) ? question.options : []
  const isText = options.length === 0 || question.type === 'text' || question.type === 'textarea'
  const multiple = !isText && question.type === 'multiple'
  const ids = selectedIds(answer)

  const handleSelect = (option) => {
    if (multiple) {
      const next = ids.includes(option.id)
        ? (Array.isArray(answer) ? answer : []).filter((item) => item.id !== option.id)
        : [...(Array.isArray(answer) ? answer : []), { id: option.id, label: option.label }]
      onAnswer(next)
      return
    }

    onAnswer({ id: option.id, label: option.label })
    onAdvance()
  }

  const hasAnswer = multiple ? ids.length > 0 : Boolean(String(answer || '').trim())

  return (
    <Box>
      <Text textStyle="mono" color="fg.muted" mb={3}>
        Pertanyaan lanjutan {index + 1}/{total}
      </Text>

      <StepHeader
        title={question.text}
        subtitle={question.description || 'Dari hasil analisa AI. Pilih yang paling sesuai.'}
      />

      {isText ? (
        <Box>
          {question.type === 'textarea' ? (
            <Textarea
              rows={3}
              fontSize="lg"
              value={typeof answer === 'string' ? answer : ''}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Tulis jawabanmu…"
              aria-label={question.text}
              autoFocus
            />
          ) : (
            <Input
              size="lg"
              h="56px"
              fontSize="lg"
              value={typeof answer === 'string' ? answer : ''}
              onChange={(e) => onAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && hasAnswer && onAdvance()}
              placeholder="Tulis jawabanmu…"
              aria-label={question.text}
              autoFocus
            />
          )}
          <Button
            variant="primary"
            size="lg"
            w="100%"
            mt={6}
            onClick={onAdvance}
            isDisabled={!hasAnswer}
          >
            Lanjut →
          </Button>
        </Box>
      ) : (
        <VStack align="stretch" spacing={2}>
          {options.map((option) => (
            <OptionCard
              key={option.id}
              title={option.label}
              description={option.description}
              selected={multiple ? ids.includes(option.id) : answer?.id === option.id}
              onClick={() => handleSelect(option)}
            />
          ))}
        </VStack>
      )}

      {multiple && (
        <Button
          variant="primary"
          size="lg"
          w="100%"
          mt={6}
          onClick={onAdvance}
          isDisabled={!hasAnswer}
        >
          Lanjut →
        </Button>
      )}
    </Box>
  )
}

export default StepDynamic
