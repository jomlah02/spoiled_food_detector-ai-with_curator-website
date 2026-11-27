import { Box, Button, Text, Textarea } from '@chakra-ui/react'
import StepHeader from './StepHeader'

function StepExtras({ answers, update, submit, submitting, submitError }) {
  const hasExtras = answers.notes.trim().length > 0

  return (
    <Box>
      <StepHeader
        title="Ada catatan tambahan?"
        subtitle="Boleh dilewati. Gunanya biar kamu ingat wadah yang mana."
      />

      <Textarea
        rows={3}
        value={answers.notes}
        onChange={(e) => update({ notes: e.target.value })}
        placeholder="sisa makan siang kantor, wadah tutup biru…"
        aria-label="Catatan tambahan"
      />

      {submitError && (
        <Text fontSize="sm" color="status.danger" mt={3}>
          {submitError}
        </Text>
      )}

      <Button
        variant="primary"
        size="lg"
        w="100%"
        mt={7}
        onClick={submit}
        isLoading={submitting}
        loadingText="Menganalisa…"
      >
        {hasExtras ? 'Lihat hasil →' : 'Lewati, lihat hasil →'}
      </Button>
    </Box>
  )
}

export default StepExtras
