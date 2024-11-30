import React, { useState } from 'react'
import { Box, Typography, IconButton, Button, Collapse } from '@mui/material'
import { ArrowBack as ArrowBackIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material'

interface PreviousGenerationProps {
  previousPrompt?: string
  handleGoToPreviousGeneration?: () => void
}

const PreviousGeneration: React.FC<PreviousGenerationProps> = ({ previousPrompt, handleGoToPreviousGeneration }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = (): void => setIsOpen(!isOpen)

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="body1" sx={styles.headerText}>
          Previous Generation
        </Typography>
        <IconButton onClick={toggleOpen} sx={styles.toggleButton}>
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isOpen}>
        <Box sx={styles.content}>
          <Typography variant="body1" sx={styles.promptText}>
            {previousPrompt}
          </Typography>

          <Box sx={styles.buttonContainer}>
            <Button
              onClick={handleGoToPreviousGeneration}
              sx={styles.goButton}
              startIcon={<ArrowBackIcon />}
            >
              Go to Previous Image
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  )
}

const styles = {
  container: {
    marginTop: '20px',
    borderRadius: '16px',
    padding: '16px',
    backgroundColor: '#F6FAFF',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#333',
  },
  toggleButton: {
    padding: 0,
    color: '#a7a7a7',
  },
  content: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
    position: 'relative',
  },
  promptText: {
    fontSize: '16px',
    color: '#333',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%'
  },
  goButton: {
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: '#007bff',
    border: '1px solid #007bff',
    borderRadius: '20px',
    padding: '8px 16px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
    }
  }
}

export default PreviousGeneration
