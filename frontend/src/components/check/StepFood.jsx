import { useState } from 'react'
import { Box, Button, Flex, Input, SimpleGrid, Text } from '@chakra-ui/react'
import { FOOD_CATEGORIES, QUICK_FOODS } from '../../constants/food'
import Chip from '../ui/Chip'
import OptionCard from '../ui/OptionCard'
import PhotoUpload from './PhotoUpload'
import StepHeader from './StepHeader'

function StepFood({ answers, update, next }) {
  const [error, setError] = useState('')

  const hasName = answers.foodName.trim().length > 0
  const hasFood = hasName || Boolean(answers.imagePreview)

  // Nama makanan diketik bebas. JENIS tidak ditebak otomatis supaya tetap
  // sepenuhnya opsional dan user yang menentukan sendiri.
  const handleNameChange = (value) => {
    setError('')
    update({ foodName: value })
  }

  // JENIS opsional: klik kartu yang sudah terpilih untuk mengosongkannya lagi.
  const toggleCategory = (categoryId) => {
    update({
      categoryId: answers.categoryId === categoryId ? null : categoryId,
      categoryTouched: true,
    })
  }

  const handleContinue = () => {
    if (!hasFood) {
      setError('Tambahkan foto, atau tulis nama makanannya dulu.')
      return
    }
    next()
  }

  return (
    <Box>
      <StepHeader
        title="Makanan apa?"
        subtitle="Kirim foto saja, atau tulis dan pilih namanya sendiri."
      />

      <PhotoUpload answers={answers} update={update} onPhotoChange={() => setError('')} />

      <Text textStyle="mono" color="fg.muted" mt={6} mb={3}>
        Atau tulis nama makanannya
      </Text>

      <Input
        size="lg"
        h="56px"
        fontSize="lg"
        value={answers.foodName}
        onChange={(e) => handleNameChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
        placeholder="opor ayam, nasi, buah potong…"
        aria-label="Nama makanan"
        aria-invalid={Boolean(error)}
        autoFocus
      />
      {error && (
        <Text fontSize="sm" color="status.danger" mt={2}>
          {error}
        </Text>
      )}

      <Flex wrap="wrap" gap={2} mt={4}>
        {QUICK_FOODS.map((food) => (
          <Chip
            key={food.label}
            selected={answers.foodName === food.label}
            onClick={() => {
              setError('')
              // Chip hanya mengisi nama. JENIS tetap manual dan boleh kosong.
              update({ foodName: food.label })
            }}
          >
            {food.label}
          </Chip>
        ))}
      </Flex>

      <Text textStyle="mono" color="fg.muted" mt={9} mb={3}>
        Jenis — opsional, boleh dikosongkan
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
        {FOOD_CATEGORIES.map((category) => (
          <OptionCard
            key={category.id}
            title={category.label}
            description={category.hint}
            selected={answers.categoryId === category.id}
            onClick={() => toggleCategory(category.id)}
          />
        ))}
      </SimpleGrid>

      <Button
        variant="primary"
        size="lg"
        w="100%"
        mt={8}
        onClick={handleContinue}
        isDisabled={!hasFood}
      >
        Lanjut →
      </Button>
    </Box>
  )
}

export default StepFood
