import { useState } from 'react'
import { Box, Button, Collapse, Flex, HStack, IconButton, Image, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { ChevronDown, Clock, HandHeart, RotateCcw, Soup, Trash2, Utensils } from 'lucide-react'
import { getCategory } from '../../constants/food'
import { STATUS } from '../../constants/status'
import { formatAgo, formatMoment, formatTimeLeft } from '../../lib/time'
import { getLiveStatus } from '../../lib/itemStatus'
import Panel from '../ui/Panel'
import StatusBadge from '../ui/StatusBadge'
import { ActionList, WhyDetails } from '../check/ResultDetails'

function KulkasItemCard({ item, now, onOutcome, onRecheck, onDelete }) {
  const [open, setOpen] = useState(false)
  const live = getLiveStatus(item, now)
  const unsafe = live.status === STATUS.DANGER

  return (
    <Panel p={0} overflow="hidden" borderColor={unsafe ? 'status.danger' : 'border'}>
      <Box p={4}>
        <HStack align="start" spacing={3}>
          {item.imagePreview ? (
            <Image src={item.imagePreview} alt="" w="48px" h="48px" borderRadius="lg" objectFit="cover" flexShrink={0} />
          ) : (
            <Flex w="48px" h="48px" borderRadius="lg" bg="bg.muted" color="fg.muted" align="center" justify="center" flexShrink={0}>
              <Soup size={22} aria-hidden="true" />
            </Flex>
          )}
          <Box flex="1" minW={0}>
            <Flex justify="space-between" align="start" gap={2} wrap="wrap">
              <Text fontWeight="bold" noOfLines={1}>
                {item.foodName}
              </Text>
              <StatusBadge status={live.status} label={live.label} />
            </Flex>
            <Text fontSize="xs" color="fg.muted" mt={0.5}>
              {getCategory(item.categoryId).label} · dicek {formatAgo(item.checkedAt, now)}
            </Text>
            {item.deadline && (
              <HStack spacing={1.5} mt={2} fontSize="sm" color={live.expired ? 'status.danger' : 'fg'}>
                <Clock size={14} aria-hidden="true" />
                <Text>
                  <b>{formatTimeLeft(item.deadline, now)}</b>
                  <Text as="span" color="fg.muted">
                    {' '}· {item.deadlineLabel.toLowerCase()} {formatMoment(item.deadline, now)}
                  </Text>
                </Text>
              </HStack>
            )}
          </Box>
        </HStack>

        <SimpleGrid columns={3} spacing={2} mt={4}>
          <Button size="sm" leftIcon={<Utensils size={15} />} onClick={() => onOutcome(item.id, 'eaten')} isDisabled={unsafe}>
            Dimakan
          </Button>
          <Button size="sm" leftIcon={<HandHeart size={15} />} onClick={() => onOutcome(item.id, 'shared')} isDisabled={unsafe}>
            Dibagikan
          </Button>
          <Button
            size="sm"
            variant={unsafe ? 'danger' : 'secondary'}
            leftIcon={<Trash2 size={15} />}
            onClick={() => onOutcome(item.id, 'tossed')}
          >
            Dibuang
          </Button>
        </SimpleGrid>
      </Box>

      <Flex
        justify="space-between"
        align="center"
        px={2}
        py={1}
        borderTop="1px solid"
        borderColor="border"
        bg="bg.muted"
      >
        <Button
          variant="ghost"
          size="sm"
          rightIcon={
            <Box transform={open ? 'rotate(180deg)' : 'none'} transition="transform 0.2s ease">
              <ChevronDown size={15} />
            </Box>
          }
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          Detail
        </Button>
        <HStack spacing={0}>
          <Button variant="ghost" size="sm" leftIcon={<RotateCcw size={15} />} onClick={() => onRecheck(item)}>
            Cek ulang
          </Button>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label={`Hapus ${item.foodName}`}
            icon={<Trash2 size={15} />}
            onClick={() => onDelete(item.id)}
          />
        </HStack>
      </Flex>

      <Collapse in={open} animateOpacity>
        <VStack align="stretch" spacing={4} p={4} borderTop="1px solid" borderColor="border">
          <Box>
            <Text fontWeight="semibold">{item.headline}</Text>
            <Text fontSize="sm" color="fg.muted" mt={1}>
              {item.summary}
            </Text>
          </Box>
          <ActionList actions={item.actions} />
          {item.notes && (
            <Text fontSize="sm" color="fg.muted">
              Catatan: {item.notes}
            </Text>
          )}
          <WhyDetails record={item} />
        </VStack>
      </Collapse>
    </Panel>
  )
}

export default KulkasItemCard
