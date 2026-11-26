import { useState } from 'react'
import { Box, Button, Flex, Input, SimpleGrid, Text } from '@chakra-ui/react'
import { ArrowRight } from 'lucide-react'
import { FOOD_CATEGORIES, QUICK_FOODS, guessCategory } from '../../constants/food'
import Chip from '../ui/Chip'
import OptionCard from '../ui/OptionCard'
import StepHeader from './StepHeader'

function StepFood({ answers, update, next }) {
  const [error, setError] = useState('')

  const handleNameChange = (value) => {
    setError('')
    update({
      foodName: value,
      // Kategori ikut menebak dari nama, kecuali sudah dipilih manual
      categoryId: answers.categoryTouched ? answers.categoryId : guessCategory(value),
    })
  }

  const handleContinue = () => {
    if (!answers.foodName.trim()) {
      setError('Tulis nama makanannya dulu, atau pilih dari pilihan cepat.')
      return
    }
    next()
  }

  return (
    <Box>
      <StepHeader title="Makanan apa yang mau dicek?" />

      <Input
        size="lg"
        value={answers.foodName}
        onChange={(e) => handleNameChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
        placeholder="Contoh: opor ayam"
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
              update({ foodName: food.label, categoryId: food.categoryId, categoryTouched: false })
            }}
          >
            {food.label}
          </Chip>
        ))}
      </Flex>

      <Text fontSize="sm" fontWeight="semibold" color="fg.muted" mt={7} mb={3}>
        Jenis makanan {answers.foodName.trim() && '(sudah ditebak, ubah kalau keliru)'}
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2.5}>
        {FOOD_CATEGORIES.map((category) => (
          <OptionCard
            key={category.id}
            title={category.label}
            description={category.hint}
            selected={answers.categoryId === category.id}
            onClick={() => update({ categoryId: category.id, categoryTouched: true })}
          />
        ))}
      </SimpleGrid>

      <Button
        variant="primary"
        size="lg"
        w="100%"
        mt={7}
        rightIcon={<ArrowRight size={18} />}
        onClick={handleContinue}
      >
        Lanjut
      </Button>
    </Box>
  )
}

export default StepFood
