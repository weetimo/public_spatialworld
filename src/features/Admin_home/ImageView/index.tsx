import React, { useState, useCallback, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  Stack,
  alpha,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Favorite as HeartIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material'
import { useDatabase } from '../../../hooks'
import { getQuestionsAndAnswers, stringToPastelColor } from './utils'

interface UserData {
  name: string;
  ageGroup: string;
  postalCode: string;
  email: string;
}

interface ImageViewProps {
  imageData: any;
  onBack: any;
}

const ImageView: React.FC<ImageViewProps> = ({ imageData, onBack }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (!imageData) return null

  const { readData } = useDatabase()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<any[]>([])

  const stableReadData = useCallback(readData, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await readData(`users/${imageData.userId}`)
        setUserData(user)

        const questions = await getQuestionsAndAnswers(
          imageData.engagementId,
          user.preferences.answers
        )
        setQuestionsAndAnswers(questions)
      } catch (error) {
        console.error('Error fetching generations data:', error)
      }
    }
  
    fetchData()
  }, [imageData, stableReadData])

  return (
    <Box
      sx={{
        p: 2,
        minHeight: '100vh',
        maxWidth: '100vw'
      }}
    >
      <IconButton
        onClick={onBack}
        sx={{
          mb: { xs: 1, sm: 2, md: 3 },
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: 'white',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }
        }}
      >
        <ArrowBackIcon />
      </IconButton>

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
          Image Details and Insights
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
          This page provides a detailed view of each image, enabling developers at URA to dive deeper into the specifics of a selected image. 
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1, sm: 2, md: 3 },
          gridTemplateColumns: {
            xs: '1fr',
            md: '2fr 3fr',
            lg: '2fr 3fr'
          },
          overflow: { md: 'hidden' }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1, sm: 2, md: 3 },
            height: '100%'
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'white',
              flex: { md: '0 0 auto' },
              height: { xs: '20vh', sm: '30vh', md: '50vh' },
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.002)'
              }
            }}
          >
            <Box
              component='img'
              src={imageData.imageUrl}
              alt={imageData.originalPrompt}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'white',
              flex: '0 0 auto'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant={isMobile ? 'subtitle1' : 'h6'}>
                Profile
              </Typography>
            </Box>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              {userData && Object.entries(userData).map(([key, value]) => (
                <Grid item xs={12} key={key}>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    display='block'
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Typography>
                  <Typography
                    fontWeight='500'
                    variant={isMobile ? 'body2' : 'body1'}
                  >
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* Right Column */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1, sm: 2, md: 3 },
            height: '100%',
            overflow: { md: 'auto' }
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'white',
              flex: { md: '1 1 auto' },
              overflow: 'auto',
              minHeight: { md: '200px' }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2,
                mb: 3
              }}
            >
              <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight='600'>
                Image Details
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={imageData.category}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    bgcolor: alpha(
                      stringToPastelColor(imageData.category),
                      0.2
                    ),
                    fontWeight: 500
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    backgroundColor: alpha('#ef4444', 0.1),
                    padding: { xs: '2px 8px', sm: '4px 12px' },
                    borderRadius: 4
                  }}
                >
                  <HeartIcon
                    fontSize={isMobile ? 'small' : 'medium'}
                    sx={{ color: '#ef4444' }}
                  />
                  <Typography sx={{ color: '#ef4444', fontWeight: 500 }}>
                    {imageData.voters?.length}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Stack spacing={{ xs: 2, sm: 3, md: 4 }}>
              <Box>
                <Typography
                  color='text.secondary'
                  variant={isMobile ? 'body2' : 'body1'}
                  gutterBottom
                >
                  User Input
                </Typography>
                <Typography variant={isMobile ? 'body2' : 'body1'}>
                  {imageData.originalPrompt}
                </Typography>
              </Box>
              <Box>
                <Typography
                  color='text.secondary'
                  variant={isMobile ? 'body2' : 'body1'}
                  gutterBottom
                >
                  Upscaled Prompt
                </Typography>
                <Typography variant={isMobile ? 'body2' : 'body1'}>
                  {imageData.upscaledPrompt}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'white',
              flex: '0 0 auto'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssignmentIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant={isMobile ? 'subtitle1' : 'h6'}>
                Questionnaire
              </Typography>
            </Box>
            <Stack spacing={{ xs: 1, sm: 2 }}>
              {questionsAndAnswers.map((qa, index) => (
                <Box
                  key={index}
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    bgcolor: 'background.default',
                    borderRadius: 4,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    {qa.question}
                  </Typography>
                  <Typography
                    fontWeight="500"
                    variant="body1"
                  >
                    {qa.answers.join(', ')}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default ImageView
