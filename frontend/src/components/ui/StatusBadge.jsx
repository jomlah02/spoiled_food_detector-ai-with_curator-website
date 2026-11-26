import { HStack, Text } from '@chakra-ui/react'
import { CircleCheck, TriangleAlert, Ban, CircleHelp } from 'lucide-react'
import { STATUS_LABELS } from '../../constants/status'

export const STATUS_ICONS = {
  ok: CircleCheck,
  caution: TriangleAlert,
  danger: Ban,
  info: CircleHelp,
}

// Status selalu tampil dengan ikon + teks, tidak hanya warna.
function StatusBadge({ status, label, size = 'sm' }) {
  const Icon = STATUS_ICONS[status] || CircleHelp
  const large = size === 'lg'
  return (
    <HStack
      as="span"
      display="inline-flex"
      spacing={1.5}
      bg={`status.${status}.bg`}
      color={`status.${status}.fg`}
      borderRadius="full"
      px={large ? 3.5 : 2.5}
      py={large ? 1.5 : 1}
      flexShrink={0}
    >
      <Icon size={large ? 18 : 14} strokeWidth={2.2} aria-hidden="true" />
      <Text as="span" fontSize={large ? 'sm' : 'xs'} fontWeight="bold" whiteSpace="nowrap">
        {label || STATUS_LABELS[status]}
      </Text>
    </HStack>
  )
}

export default StatusBadge
