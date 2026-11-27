import { useRef, useState } from 'react'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { downscaleImage } from '../../lib/image'

function PhotoUpload({ answers, update, onPhotoChange }) {
  const fileInputRef = useRef(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = async (file) => {
    setError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Itu bukan gambar. Pilih foto JPG, PNG, atau WEBP.')
      return
    }
    setLoading(true)
    try {
      const imagePreview = await downscaleImage(file)
      update({ photoFile: file, imagePreview })
      onPhotoChange?.()
    } catch {
      setError('Fotonya gagal dibuka. Coba foto lain.')
    } finally {
      setLoading(false)
    }
  }

  const removePhoto = () => {
    update({ photoFile: null, imagePreview: null })
    onPhotoChange?.()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {answers.imagePreview ? (
        <Box>
          <Box p={2} pb={8} bg="bg.surface" border="1.5px solid" borderColor="border" borderRadius="label" maxW="280px" transform="rotate(-1.5deg)">
            <Image src={answers.imagePreview} alt="Foto makanan" w="100%" maxH="240px" objectFit="cover" />
          </Box>
          <Button variant="ghost" size="sm" mt={3} onClick={removePhoto}>
            Hapus foto
          </Button>
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
          gap={1}
          py={9}
          borderRadius="label"
          border="1.5px dashed"
          borderColor="border"
          color="fg.muted"
          _hover={{ bg: 'bg.surface', color: 'fg' }}
        >
          <Text textStyle="mono">{loading ? 'Membuka foto…' : '+ Tambah foto'}</Text>
          <Text fontSize="sm" color="fg.subtle">dari kamera atau galeri</Text>
        </Flex>
      )}
      {error && (
        <Text fontSize="sm" color="status.danger" mt={2}>
          {error}
        </Text>
      )}
    </Box>
  )
}

export default PhotoUpload
