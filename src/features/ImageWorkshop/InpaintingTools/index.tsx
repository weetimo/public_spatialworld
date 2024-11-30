import React, { useState } from 'react'
import { Box, IconButton, Slider } from '@mui/material'
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  Brush as BrushIcon,
} from '@mui/icons-material'

interface InpaintingToolsProps {
  brushSize: number
  setBrushSize: React.Dispatch<React.SetStateAction<number>>
  handleUndo: () => void
  handleRedo: () => void
}

const InpaintingTools: React.FC<InpaintingToolsProps> = ({ brushSize, setBrushSize, handleUndo, handleRedo }) => {
  const [activeTool, setActiveTool] = useState<string>('brush')

  const handleToolClick = (tool: string, action?: () => void): void => {
    setActiveTool(tool)
    if (action) action()
  }

  return (
    <Box sx={styles.container}>
      {/* Undo and Redo Buttons */}
      <Box sx={styles.undoRedoContainer}>
        <IconButton
          onClick={() => handleToolClick('undo', handleUndo)}
          sx={{
            ...styles.iconButton,
            backgroundColor: activeTool === 'undo' ? '#C9DDF8' : '#EDEDED',
          }}
        >
          <UndoIcon sx={styles.icon} />
        </IconButton>

        <IconButton
          onClick={() => handleToolClick('redo', handleRedo)}
          sx={{
            ...styles.iconButton,
            backgroundColor: activeTool === 'redo' ? '#C9DDF8' : '#EDEDED',
          }}
        >
          <RedoIcon sx={styles.icon} />
        </IconButton>
      </Box>

      {/* Brush Icon and Slider */}
      <Box sx={styles.brushContainer}>
        <IconButton
          onClick={() => handleToolClick('brush')}
          sx={{
            ...styles.iconButton,
            backgroundColor: activeTool === 'brush' ? '#C9DDF8' : '#EDEDED',
          }}
        >
          <BrushIcon sx={styles.icon} />
        </IconButton>

        <Slider
          value={brushSize}
          onChange={(_, value) => {
            setBrushSize(value as number)
            setActiveTool('brush')
          }}
          aria-label="Brush Size"
          sx={{
            flexGrow: 1,
            color: activeTool === 'brush' ? '#C9DDF8' : '#EDEDED',
          }}
        />
      </Box>
    </Box>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    marginTop: '1rem',
  },
  undoRedoContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '4rem',
    width: '100%',
  },
  brushContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    marginTop: '2rem',
  },
  iconButton: {
    borderRadius: '0.4rem',
    width: '4rem',
    height: '3.5rem',
    '&:hover': {
      backgroundColor: '#D3D3D3',
    },
    '&:focus': {
      outline: 'none',
      backgroundColor: '#C9DDF8',
    },
    '&:focus-visible': {
      outline: 'none',
    }
  },
  icon: {
    color: '#000'
  }
}

export default InpaintingTools
