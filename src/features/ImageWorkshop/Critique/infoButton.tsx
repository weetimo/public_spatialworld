import React from 'react'
import { IconButton, Box } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { CritiqueProps } from './dialog'

interface InfoCritiqueButtonProps {
  onInfoClick: () => void
  critique?: CritiqueProps[]
}

const InfoCritiqueButton: React.FC<InfoCritiqueButtonProps> = ({ onInfoClick, critique }) => {
  return (
    <Box sx={styles.container}>
      <IconButton
        edge="end"
        onClick={onInfoClick}
        sx={{
          ...styles.infoButton,
          visibility: critique ? 'visible' : 'hidden'
        }}
      >
        <InfoIcon sx={styles.icon} />
      </IconButton>
    </Box>
  )
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '1rem',
    boxSizing: 'border-box',
    height: '60px',
    zIndex: 5,
  },
  infoButton: {
    '&:focus': { outline: 'none' },
    '&:focus-visible': { outline: 'none' },
  },
  icon: {
    fontSize: '32px',
    color: '#000',
  }
}

export default InfoCritiqueButton
