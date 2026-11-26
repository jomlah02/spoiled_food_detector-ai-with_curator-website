import { Grid, Text } from '@chakra-ui/react'

// Baris "KUNCI   nilai" ala label cetak.
function LabelRows({ rows }) {
  return (
    <Grid templateColumns="76px 1fr" rowGap={1.5} columnGap={3} fontFamily="mono" fontSize="13px">
      {rows.map(([key, value]) => [
        <Text key={`${key}-k`} color="fg.subtle" textTransform="uppercase" letterSpacing="0.08em" fontSize="11px" pt="2px">
          {key}
        </Text>,
        <Text key={`${key}-v`} color="fg">
          {value}
        </Text>,
      ])}
    </Grid>
  )
}

export default LabelRows
