import { Box, Button, Flex, Heading, Image, Stack, Text, VStack } from '@chakra-ui/react'
import { getCategory } from '../../constants/food'
import { getLiveStatus } from '../../lib/itemStatus'
import { labelRowsFor } from '../../lib/labelRows'
import Label from '../ui/Label'
import LabelRows from '../ui/LabelRows'
import Stamp from '../ui/Stamp'
import { ActionList, WasteTip, WhyDetails } from './ResultDetails'

function CheckResult({ record, now, showWasteGuidance, onNewCheck, onOpenKulkas }) {
  const live = getLiveStatus(record, now)

  return (
    <VStack align="stretch" spacing={8} pt={3}>
      <Label tape tapeAt="38%" p={{ base: 5, sm: 7 }} animation="labelIn 0.4s ease-out both">
        <Flex justify="space-between" align="start" gap={4}>
          <Text textStyle="mono" color="fg.muted" pt={1}>
            {record.foodName} · {getCategory(record.categoryId).label}
          </Text>
          {record.imagePreview && (
            <Image
              src={record.imagePreview}
              alt=""
              w="60px"
              h="60px"
              objectFit="cover"
              border="1.5px solid"
              borderColor="border"
              borderRadius="2px"
              transform="rotate(3deg)"
              flexShrink={0}
            />
          )}
        </Flex>

        <Heading as="h1" fontSize={{ base: '32px', sm: '40px' }} lineHeight="1.05" mt={3}>
          {record.headline}
        </Heading>

        <Box mt={5}>
          <Stamp status={live.status} label={live.label} size="lg" animate />
        </Box>

        <Text mt={5} color="fg.muted">
          {record.summary}
        </Text>

        <Box mt={5} pt={4} borderTop="1.5px dashed" borderColor="border.soft">
          <LabelRows rows={labelRowsFor(record, now)} />
        </Box>
      </Label>

      <Box>
        <Text textStyle="mono" color="fg.muted" mb={1}>
          Yang perlu dilakukan
        </Text>
        <ActionList actions={record.actions} />
      </Box>

      {showWasteGuidance && record.wasteGuidance && <WasteTip>{record.wasteGuidance}</WasteTip>}

      <WhyDetails record={record} />

      <Box pt={2}>
        <Text fontSize="sm" color="fg.muted" mb={3}>
          Label ini sudah ditempel di Kulkas saya.
        </Text>
        <Stack direction={{ base: 'column', sm: 'row' }} spacing={2}>
          <Button variant="primary" size="lg" flex="1" onClick={onNewCheck}>
            Cek makanan lain
          </Button>
          <Button size="lg" flex="1" onClick={onOpenKulkas}>
            Lihat Kulkas saya
          </Button>
        </Stack>
      </Box>
    </VStack>
  )
}

export default CheckResult
