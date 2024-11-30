import React from 'react'
import { Dialog, DialogActions, DialogContent, Box, Typography, Button } from '@mui/material'
import Critique from './critique'

interface CritiqueDialogProps {
  open: boolean
  onClose: () => void
  critique: CritiqueProps[]
  generatedImageUrl: string
}

export interface CritiqueProps {
  character?: string
  feedback?: string
}

const CritiqueDialog: React.FC<CritiqueDialogProps> = ({ open, onClose, critique, generatedImageUrl }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: styles.dialogPaper }}
    >
      {generatedImageUrl && (
        <Box sx={styles.imageContainer}>
          <Box component="img" src={generatedImageUrl} alt="Generated" sx={styles.image} />
        </Box>
      )}

      <Box sx={styles.titleContainer}>
        <Typography variant="h6">Impact</Typography>
      </Box>

      <DialogContent>
        <Critique critique={critique} />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          sx={styles.acknowledgeButton}
        >
          Acknowledged
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const styles = {
  dialogPaper: {
    maxHeight: '60vh',
    borderRadius: '1.2rem'
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem'
  },
  imageContainer: {
    width: '80%',
    margin: '0.2rem auto',
    paddingTop: '1.4rem'
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
    marginBottom: '1rem',
    borderRadius: '1.2rem'
  },
  acknowledgeButton: {
    width: '90%',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '1rem',
    padding: '0.75rem',
    margin: 'auto',
    marginTop: '1rem',
    marginBottom: '1rem',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#0056b3'
    }
  }
}

export default CritiqueDialog
