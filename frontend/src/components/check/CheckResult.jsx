import { Box, Button, Heading, HStack, Image, Stack, Text, VStack } from '@chakra-ui/react'
import { Clock, Plus, Refrigerator } from 'lucide-react'
import { getCategory } from '../../constants/food'
import { formatMoment, formatTimeLeft } from '../../lib/time'
import { getLiveStatus } from '../../lib/itemStatus'
import StatusBadge from '../ui/StatusBadge'
import { ActionList, WasteTip, WhyDetails } from './ResultDetails'

function CheckResult({ record, now, showWasteGuidance, onNewCheck, onOpenKulkas }) {
  const live = getLiveStatus(record, now)
  const status = live.status

  return (
    <VStack align="stretch" spacing={5} animation="popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both">
      <Box
        borderRadius="2xl"
        overflow="hidden"
        border="1px solid"
        borderColor={`status.${status}`}
        bg="bg.surface"
      >
        <Box bg={`status.${status}.bg`} px={{ base: 5, sm: 6 }} py={{ base: 5, sm: 6 }}>
          <HStack justify="space-between" align="start" spacing={3}>
            <Box>
              <Text fontSize="sm" color={`status.${status}.fg`} fontWeight="semibold" mb={2}>
                {record.foodName} · {getCategory(record.categoryId).label}
              </Text>
              <StatusBadge status={status} label={live.label} size="lg" />
            </Box>
            {record.imagePreview && (
              <Image
                src={record.imagePreview}
                alt=""
                w="64px"
                h="64px"
                borderRadius="lg"
                objectFit="cover"
                flexShrink={0}
              />
            )}
          </HStack>
          <Heading as="h1" fontSize={{ base: '2xl', sm: '3xl' }} fontWeight="extrabold" mt={4} color={`status.${status}.fg`}>
            {record.headline}
          </Heading>
          <Text mt={2} color={`status.${status}.fg`}>
            {record.summary}
          </Text>

          {record.deadline && !live.expired && (
            <HStack
              mt={4}
              spacing={2}
              display="inline-flex"
              bg="bg.surface"
              color="fg"
              px={3}
              py={2}
              borderRadius="lg"
              fontSize="sm"
            >
              <Clock size={16} aria-hidden="true" />
              <Text>
                {record.deadlineLabel} <b>{formatMoment(record.deadline, now)}</b>
                <Text as="span" color="fg.muted"> · {formatTimeLeft(record.deadline, now)}</Text>
              </Text>
            </HStack>
          )}
        </Box>

        <VStack align="stretch" spacing={5} px={{ base: 5, sm: 6 }} py={5}>
          <Box>
            <Text fontWeight="bold" mb={3}>
              Yang perlu dilakukan sekarang
            </Text>
            <ActionList actions={record.actions} />
          </Box>

          {showWasteGuidance && record.wasteGuidance && <WasteTip>{record.wasteGuidance}</WasteTip>}

          <WhyDetails record={record} />
        </VStack>
      </Box>

      <Text fontSize="sm" color="fg.muted" textAlign="center">
        Tersimpan otomatis di Kulkas saya.
      </Text>

      <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
        <Button variant="primary" size="lg" flex="1" leftIcon={<Plus size={18} />} onClick={onNewCheck}>
          Cek makanan lain
        </Button>
        <Button size="lg" flex="1" leftIcon={<Refrigerator size={18} />} onClick={onOpenKulkas}>
          Buka Kulkas saya
        </Button>
      </Stack>
    </VStack>
  )
}

export default CheckResult
