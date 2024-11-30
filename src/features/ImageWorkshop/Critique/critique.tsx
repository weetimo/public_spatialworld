import React, { memo } from 'react'
import { Box, Typography } from '@mui/material'
import { CritiqueProps } from './dialog'

const NO_CRITIQUE_MESSAGE = 'No critique available, please click on the "Tools" tab to start editing.'

const Critique: React.FC<{ critique: CritiqueProps[] }> = memo(({ critique }) => {
  const renderCritique = (critiqueArr: CritiqueProps[]) => {
    if (critiqueArr?.length === 0) return NO_CRITIQUE_MESSAGE

    return critiqueArr.map((item, index) => {      
      return (
        <Box key={index} sx={styles.section}>
          <Typography variant="body1" sx={styles.boldText}>
            {item.character}
          </Typography>
          <Typography variant="body2">
            {item.feedback}
          </Typography>
        </Box>
      )
    })
  }

  return (
    <Box sx={styles.container}>
      {renderCritique(critique)}
    </Box>
  )
})

const styles = {
  container: {
    padding: '0.6rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  },
  section: {
    marginBottom: '2rem'
  },
  boldText: {
    fontWeight: 'bold'
  }
}

export default Critique
