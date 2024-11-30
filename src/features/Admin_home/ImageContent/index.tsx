import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Chip,
  Paper,
  Grid,
  Stack,
  InputAdornment,
  TextField,
  alpha,
  IconButton
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Favorite as HeartIcon } from '@mui/icons-material'
import ClearIcon from '@mui/icons-material/Clear'
import Fuse from 'fuse.js'
import ImageView from '../ImageView'
import { useDatabase } from '../../../hooks'
import { calculateStats, stringToPastelColor } from './utils'

const ImageContent: React.FC<{ engagementId: string }> = ({ engagementId }) => {
  const { readData } = useDatabase()

  const [generations, setGenerations] = useState<any[]>([])

  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  const { distributionStats } = calculateStats(generations)

  const predefinedCategories = [{ name: 'All', color: '#e5e7eb' }]

  const stableReadData = useCallback(readData, [])

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const data = await readData(`generations/${engagementId}`)
        const formattedData = Object.values(data).map((img: any) => img)
        setGenerations(formattedData)
      } catch (error) {
        console.error('Error fetching generations data:', error)
      }
    }

    if (engagementId) {
      fetchGenerations()
    }
  }, [engagementId, stableReadData])

  const fuse = useMemo(
    () =>
      new Fuse(generations, {
        keys: ['upscaledPrompt'],
        threshold: 0.6,
        minMatchCharLength: 1,
        shouldSort: true
      }),
    [generations]
  )

  const getFilteredImages = useMemo(() => {
    let results = generations
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery)
      results = searchResults.map((result) => result.item)
    }
    if (activeCategory !== 'All') {
      results = results.filter((img) => img.category === activeCategory)
    }
    return results
  }, [searchQuery, activeCategory, fuse])

  if (selectedImage) {
    return (
      <ImageView
        imageData={selectedImage}
        onBack={() => setSelectedImage(null)}
      />
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          marginBottom: 4
        }}
      >
        <Typography
          variant='h1'
          sx={{
            fontSize: {
              xs: '1.5rem',
              md: '2rem'
            },
            fontWeight: 700,
            color: 'text.primary',
            marginBottom: 1
          }}
        >
          Urban Development Image Gallery
        </Typography>
        <Typography
          align='justify'
          sx={{
            color: 'text.secondary',
            fontSize: {
              xs: '0.875rem',
              md: '1rem'
            },
            maxWidth: '60rem'
          }}
        >
          This page visually categorizes the image generations into themes derived from topic modeling using vision models.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search image descriptions...'
          variant='outlined'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position='end'>
                <IconButton onClick={() => setSearchQuery('')} size='small'>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 4,
              '&:hover': {
                bgcolor: 'background.paper'
              }
            }
          }}
        />
        {searchQuery && (
          <Typography variant='body2' color='textSecondary' sx={{ mt: 1 }}>
            Found {getFilteredImages.length} results for "{searchQuery}"
          </Typography>
        )}
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {predefinedCategories
          .concat(
            distributionStats.map((stat) => ({
              name: stat.category,
              color: stat.color
            }))
          )
          .map((category) => (
            <Chip
              key={category.name}
              label={category.name}
              onClick={() => setActiveCategory(category.name)}
              sx={{
                bgcolor:
                  activeCategory === category.name
                    ? category.color
                    : 'transparent',
                border: '1px solid',
                borderColor: category.color,
                '&:hover': {
                  bgcolor: alpha(category.color, 0.2)
                }
              }}
            />
          ))}
      </Box>

      <Grid sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 4
            }}
          >
            <Typography variant='h6' gutterBottom>
              Category Distribution
            </Typography>
            <Stack spacing={2} sx={{ p: 2 }}>
              {distributionStats.map((stat) => (
                <Box key={stat.category}>
                  <Box display='flex' justifyContent='space-between' mb={0.5}>
                    <Typography
                      variant='body2'
                      sx={{
                        transform:
                          activeCategory === stat.category
                            ? 'scale(1.05)'
                            : 'scale(1)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      {stat.category}
                    </Typography>
                    <Typography
                      variant='body2'
                      fontWeight='medium'
                      sx={{
                        transform:
                          activeCategory === stat.category
                            ? 'scale(1.05)'
                            : 'scale(1)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      {Math.round(stat.percentage)}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.100',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        width: `${stat.percentage}%`,
                        height: '100%',
                        bgcolor:
                          activeCategory === stat.category
                            ? stat.color
                            : alpha(stat.color, 0.4),
                        transition:
                          'width 0.5s ease, background-color 0.3s ease'
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 3fr))',
          gap: 3
        }}
      >
        {getFilteredImages?.map((image) => (
          <Paper
            key={image.id}
            elevation={0}
            onClick={() => setSelectedImage(image)}
            sx={{
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.02)',
                '& .image-overlay': {
                  opacity: 1
                }
              }
            }}
          >
            <Box
              component='img'
              src={image.imageUrl}
              sx={{
                width: '100%',
                objectFit: 'cover',
                height: '300px',
                display: 'block'
              }}
            />
            <Box
              className='image-overlay'
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                opacity: 0,
                transition: 'opacity 0.2s'
              }}
            >
              <Typography variant='subtitle1' sx={{ mb: 1, padding: 1 }}>
                {image.upscaledPrompt}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 1, pb: 1 }}>
                <HeartIcon fontSize='small' sx={{ color: '#ef4444' }} />
                <Typography
                  variant='caption'
                  sx={{ ml: 0.5, color: '#ef4444' }}
                >
                  {image.voters?.length}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={image.category}
              size='small'
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                bgcolor: stringToPastelColor(image.category),
                '& .MuiChip-label': {
                  px: 1,
                  fontSize: '0.75rem'
                }
              }}
            />
          </Paper>
        ))}
      </Box>

      {getFilteredImages?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color='textSecondary'>
            No images found matching your criteria
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default ImageContent
