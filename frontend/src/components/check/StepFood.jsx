import { useState } from 'react'
import { Box, Button, Flex, Input, SimpleGrid, Text } from '@chakra-ui/react'
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
      categoryId: answers.categoryTouched ? answers.categoryId : guessCategory(value),
    })
  }

  const handleContinue = () => {
    if (!answers.foodName.trim()) {
      setError('Tulis nama makanannya dulu, atau ketuk salah satu di bawah.')
      return
    }
    next()
  }

  return (
    <Box>
      <StepHeader title="Makanan apa?" />

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
              update({ foodName: food.label, categoryId: food.categoryId, categoryTouched: false })
            }}
          >
            {food.label}
          </Chip>
        ))}
      </Flex>

      <Text textStyle="mono" color="fg.muted" mt={9} mb={3}>
        Jenis {answers.foodName.trim() && '— sudah kami tebak, ganti kalau salah'}
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
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

      <Button variant="primary" size="lg" w="100%" mt={8} onClick={handleContinue}>
        Lanjut →
      </Button>
    </Box>
  )
}

export default StepFood
