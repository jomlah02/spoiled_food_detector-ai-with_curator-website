import { Box } from '@chakra-ui/react'
import { STATUS_LABELS, STATUS_STAMPS } from '../../constants/status'

// Status sebagai stempel tinta. Teksnya sendiri sudah menjelaskan, tidak hanya warna.
function Stamp({ status, label, size = 'sm', animate = false }) {
  const large = size === 'lg'
  return (
    <Box
      as="span"
      display="inline-block"
      title={STATUS_LABELS[status]}
      border={large ? '2.5px solid' : '2px solid'}
      borderColor={`status.${status}`}
      color={`status.${status}`}
      borderRadius="2px"
      px={large ? 3 : 2}
      py={large ? 1 : '1px'}
      fontFamily="mono"
      fontWeight={600}
      fontSize={large ? 'md' : '11px'}
      letterSpacing="0.12em"
      textTransform="uppercase"
      whiteSpace="nowrap"
      transform="rotate(-3deg)"
      animation={animate ? 'stampIn 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2) 0.15s both' : undefined}
    >
      {label || STATUS_STAMPS[status]}
    </Box>
  )
}

export default Stamp
