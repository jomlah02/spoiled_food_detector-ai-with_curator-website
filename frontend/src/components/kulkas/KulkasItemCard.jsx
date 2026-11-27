import { useState } from 'react'
import { Box, Button, Collapse, Flex, HStack, Image, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { getCategory } from '../../constants/food'
import { STATUS } from '../../constants/status'
import { formatAgo, formatMoment, formatTimeLeft } from '../../lib/time'
import { getLiveStatus } from '../../lib/itemStatus'
import Label from '../ui/Label'
import Stamp from '../ui/Stamp'
import TextButton from '../ui/TextButton'
import { ActionList, WhyDetails } from '../check/ResultDetails'

function KulkasItemCard({ item, now, tilt = 0, tapeAt = '50%', onOutcome, onRecheck, onDelete }) {
  const [open, setOpen] = useState(false)
  const live = getLiveStatus(item, now)
  const unsafe = live.status === STATUS.DANGER

  return (
    <Label tape tapeAt={tapeAt} tilt={tilt} p={0}>
      <Box px={4} pt={5} pb={4}>
        <Flex gap={3} align="start">
          {item.imagePreview && (
            <Image
              src={item.imagePreview}
              alt=""
              w="52px"
              h="52px"
              objectFit="cover"
              border="1.5px solid"
              borderColor="border"
              borderRadius="2px"
              flexShrink={0}
            />
          )}
          <Box flex="1" minW={0}>
            <Flex justify="space-between" align="start" gap={3}>
              <Text fontFamily="heading" fontSize="22px" fontWeight={600} lineHeight="1.15" noOfLines={2}>
                {item.foodName}
              </Text>
              <Box pt={1}>
                <Stamp status={live.status} label={live.label} />
              </Box>
            </Flex>
            <Text fontFamily="mono" fontSize="11px" color="fg.subtle" mt={1}>
              {getCategory(item.categoryId).label.toLowerCase()} · dicek {formatAgo(item.checkedAt, now)}
            </Text>
          </Box>
        </Flex>

        {item.deadline && (
          <Text fontFamily="mono" fontSize="13px" mt={3} color={live.expired ? 'status.danger' : 'fg'}>
            <Text as="span" fontWeight={600} textTransform="uppercase">
              {formatTimeLeft(item.deadline, now)}
            </Text>
            <Text as="span" color="fg.muted">
              {' '}— {item.deadlineLabel.toLowerCase()} {formatMoment(item.deadline, now)}
            </Text>
          </Text>
        )}

        {unsafe ? (
          <Button variant="danger" size="sm" w="100%" mt={4} onClick={() => onOutcome(item.id, 'tossed')}>
            Sudah dibuang
          </Button>
        ) : (
          <SimpleGrid columns={3} spacing={2} mt={4}>
            <Button size="sm" onClick={() => onOutcome(item.id, 'eaten')}>Dimakan</Button>
            <Button size="sm" onClick={() => onOutcome(item.id, 'shared')}>Dibagikan</Button>
            <Button size="sm" onClick={() => onOutcome(item.id, 'tossed')}>Dibuang</Button>
          </SimpleGrid>
        )}
      </Box>

      <Flex justify="space-between" px={4} py={2.5} borderTop="1.5px dashed" borderColor="border.soft">
        <TextButton fontSize="11px" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? '− Tutup' : '+ Detail'}
        </TextButton>
        <HStack spacing={4}>
          <TextButton fontSize="11px" onClick={() => onRecheck(item)}>Cek ulang</TextButton>
          <TextButton fontSize="11px" onClick={() => onDelete(item.id)} aria-label={`Hapus ${item.foodName}`}>
            Hapus
          </TextButton>
        </HStack>
      </Flex>

      <Collapse in={open} animateOpacity>
        <VStack align="stretch" spacing={4} px={4} pb={4} pt={1}>
          <Box>
            <Text fontWeight={600}>{item.headline}</Text>
            <Text fontSize="sm" color="fg.muted" mt={1}>{item.summary}</Text>
          </Box>
          <ActionList actions={item.actions} />
          {item.notes && (
            <Text fontFamily="heading" fontStyle="italic" color="fg.muted">
              “{item.notes}”
            </Text>
          )}
          <WhyDetails record={item} />
        </VStack>
      </Collapse>
    </Label>
  )
}

export default KulkasItemCard
