import { Box, Collapse, SimpleGrid, Text } from '@chakra-ui/react'
import { PRE_ROOM_OPTIONS, STORAGE_OPTIONS, isColdStorage } from '../../constants/food'
import Chip from '../ui/Chip'
import OptionCard from '../ui/OptionCard'
import StepHeader from './StepHeader'

function StepStorage({ answers, update, advance }) {
  const cold = isColdStorage(answers.storageId)
  const place = answers.storageId === 'freezer' ? 'freezer' : 'kulkas'

  const selectStorage = (storageId) => {
    // kulkas/freezer masih ada 1 pertanyaan lagi
    if (isColdStorage(storageId)) {
      update({ storageId, preRoom: storageId === answers.storageId ? answers.preRoom : null })
    } else {
      advance({ storageId, preRoom: null })
    }
  }

  return (
    <Box>
      <StepHeader title="Habis itu disimpan di mana?" />

      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
        {STORAGE_OPTIONS.map((option) => (
          <OptionCard
            key={option.id}
            title={option.label}
            description={option.desc}
            selected={answers.storageId === option.id}
            onClick={() => selectStorage(option.id)}
          />
        ))}
      </SimpleGrid>

      <Collapse in={cold} animateOpacity>
        <Box mt={6} pt={5} borderTop="1.5px dashed" borderColor="border.soft">
          <Text fontFamily="heading" fontSize="xl" fontWeight={600} mb={1}>
            Sebelum masuk {place}, sempat di luar berapa lama?
          </Text>
          <Text fontSize="sm" color="fg.muted" mb={4}>
            Misalnya didiamkan di meja dulu sampai dingin.
          </Text>
          <SimpleGrid columns={2} spacing={2}>
            {PRE_ROOM_OPTIONS.map((option) => (
              <Chip
                key={option.id}
                selected={answers.preRoom === option.id}
                onClick={() => advance({ preRoom: option.id })}
                py={3}
              >
                {option.label}
              </Chip>
            ))}
          </SimpleGrid>
        </Box>
      </Collapse>
    </Box>
  )
}

export default StepStorage
