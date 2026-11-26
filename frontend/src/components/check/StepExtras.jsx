import { useRef, useState } from 'react'
import { Box, Button, Flex, IconButton, Image, Text, Textarea } from '@chakra-ui/react'
import { ArrowRight, Camera, X } from 'lucide-react'
import { downscaleImage } from '../../lib/image'
import StepHeader from './StepHeader'

function StepExtras({ answers, update, finish }) {
  const fileInputRef = useRef(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const hasExtras = Boolean(answers.imagePreview || answers.notes.trim())

  const handleFile = async (file) => {
    setError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('File ini bukan gambar. Pilih foto JPG, PNG, atau WEBP.')
      return
    }
    setLoading(true)
    try {
      update({ imagePreview: await downscaleImage(file) })
    } catch {
      setError('Foto gagal dimuat. Coba foto lain.')
    } finally {
      setLoading(false)
    }
  }

  const removePhoto = () => {
    update({ imagePreview: null })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Box>
      <StepHeader
        title="Mau tambah foto atau catatan?"
        subtitle="Opsional. Membantu kamu ingat makanan yang mana."
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {answers.imagePreview ? (
        <Box position="relative" borderRadius="xl" overflow="hidden" border="1px solid" borderColor="border">
          <Image src={answers.imagePreview} alt="Foto makanan" w="100%" maxH="260px" objectFit="cover" />
          <IconButton
            position="absolute"
            top={2}
            right={2}
            size="sm"
            borderRadius="full"
            onClick={removePhoto}
            aria-label="Hapus foto"
            icon={<X size={16} />}
          />
        </Box>
      ) : (
        <Flex
          as="button"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          w="100%"
          direction="column"
          align="center"
          justify="center"
          gap={2}
          py={8}
          borderRadius="xl"
          border="1.5px dashed"
          borderColor="border.strong"
          bg="bg.surface"
          color="fg.muted"
          _hover={{ borderColor: 'brand', color: 'brand' }}
        >
          <Camera size={26} aria-hidden="true" />
          <Text fontWeight="semibold">{loading ? 'Memuat foto…' : 'Tambah foto'}</Text>
        </Flex>
      )}
      {error && (
        <Text fontSize="sm" color="status.danger" mt={2}>
          {error}
        </Text>
      )}

      <Textarea
        mt={4}
        rows={3}
        value={answers.notes}
        onChange={(e) => update({ notes: e.target.value })}
        placeholder="Contoh: sisa makan siang kantor, wadah biru"
        aria-label="Catatan"
      />

      <Button
        variant="primary"
        size="lg"
        w="100%"
        mt={6}
        rightIcon={<ArrowRight size={18} />}
        onClick={finish}
        isLoading={loading}
      >
        {hasExtras ? 'Lihat hasil' : 'Lewati dan lihat hasil'}
      </Button>
    </Box>
  )
}

export default StepExtras
