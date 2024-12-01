import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import { garden1, garden2, garden3 } from '../../assets/sample-photos'
import { useDatabase } from '../../hooks'

const steps = [
  {
    title: 'Welcome!',
    description: 'Enjoy the wonderful journey with us to create your desired neighborhood and hometown.',
    image: garden1
  },
  {
    title: 'Your Canvas: The Green Field',
    description: 'Begin with a blank slate, and imagine and shape this open space into your ideal vision with the power of AI!',
    image: garden2
  },
  {
    title: 'Regenerating...',
    description: 'Explore the creative possibilities of AI-generated images! Our app is designed to let you experiment with regenerating images in unique and exciting ways through advanced AI tools.',
    image: garden3
  }
]

const Welcome: React.FC = () => {
  const { id } = useParams()
  const engagementId = id

  const navigate = useNavigate()
  const { readData } = useDatabase()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [location, setLocationLink] = useState('')

  const stableReadData = useCallback(readData, [])

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const data = await readData(`engagements/${engagementId}`)
        setLocationLink(data.location)
        console.log('Location loaded successfully:', data)
      } catch (error) {
        console.error('Error fetching engagement:', error)
      }
    }

    fetchEngagement()
  }, [stableReadData, engagementId, readData])

  const handleNext = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      navigate(`/user-details/${engagementId}`)
    }
  }

  return (
    <Box sx={styles.container}>
      {/* Step Image */}
      <Box sx={styles.imageContainer}>
        <Box
          component="img"
          src={steps[currentStep].image}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover' as const
          }}
        />
      </Box>

      {/* Content Area */}
      <Box sx={styles.content}>
        {/* Indicator Dots */}
        <Box sx={styles.indicatorContainer}>
          {steps.map((_, index) => (
            <Box
              key={index}
              sx={{
                ...styles.indicator,
                backgroundColor: index === currentStep ? '#007bff' : '#d3d3d3',
              }}
            />
          ))}
        </Box>

        <Typography variant="h4" sx={styles.title}>
          {steps[currentStep].title}
        </Typography>
        <Typography variant="body1" sx={styles.description}>
          {steps[currentStep].description}
        </Typography>

        {currentStep === steps.length - 1 && location && (
          <Button
            variant="contained"
            href={location}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ ...styles.nextButton, ...styles.mapButton, marginBottom: '1rem' }}
            fullWidth
          >
            View Location in Maps
          </Button>
        )}

        <Button
          variant="contained"
          onClick={handleNext}
          sx={styles.nextButton}
          fullWidth
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    width: '100%',
    height: '55%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: '2rem'
  },
  indicatorContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '8px',
    marginBottom: '1.5rem',
  },
  indicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#333',
  },
  description: {
    color: '#666',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '3rem',
  },
  mapButton: {
    backgroundColor: '#4bbfb4',
    '&:hover': {
      backgroundColor: '#4bbfb4',
    },
  },
  nextButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    textTransform: 'none',
    padding: '0.6rem 1.5rem',
    borderRadius: '0.6rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#005bb5',
    },
  },
}

export default Welcome
