import { Box, Collapse, SimpleGrid, Text } from '@chakra-ui/react'
import { CircleHelp, Package, PackageOpen, Refrigerator, Snowflake } from 'lucide-react'
import { PRE_ROOM_OPTIONS, STORAGE_OPTIONS, isColdStorage } from '../../constants/food'
import Chip from '../ui/Chip'
import OptionCard from '../ui/OptionCard'
import StepHeader from './StepHeader'

const STORAGE_ICONS = {
  fridge: Refrigerator,
  freezer: Snowflake,
  room_covered: Package,
  room_open: PackageOpen,
  unknown: CircleHelp,
}

function StepStorage({ answers, update, advance }) {
  const cold = isColdStorage(answers.storageId)
  const place = answers.storageId === 'freezer' ? 'freezer' : 'kulkas'

  const selectStorage = (storageId) => {
    if (isColdStorage(storageId)) {
      // Kulkas/freezer: tanya dulu berapa lama di luar sebelumnya
      update({ storageId, preRoom: storageId === answers.storageId ? answers.preRoom : null })
    } else {
      advance({ storageId, preRoom: null })
    }
  }

  return (
    <Box>
      <StepHeader title="Sejak itu disimpan di mana?" />

      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2.5}>
        {STORAGE_OPTIONS.map((option) => (
          <OptionCard
            key={option.id}
            icon={STORAGE_ICONS[option.id]}
            title={option.label}
            description={option.desc}
            selected={answers.storageId === option.id}
            onClick={() => selectStorage(option.id)}
          />
        ))}
      </SimpleGrid>

      <Collapse in={cold} animateOpacity>
        <Box mt={5} p={4} borderRadius="xl" bg="bg.muted">
          <Text fontWeight="semibold" mb={3}>
            Sebelum masuk {place}, berapa lama di suhu ruang?
          </Text>
          <SimpleGrid columns={2} spacing={2}>
            {PRE_ROOM_OPTIONS.map((option) => (
              <Chip
                key={option.id}
                selected={answers.preRoom === option.id}
                onClick={() => advance({ preRoom: option.id })}
                py={2.5}
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
