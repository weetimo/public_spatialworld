import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'  
import { Box, IconButton, Tooltip, Divider, Dialog, DialogContent, Slide } from '@mui/material'  
import { ArrowForward as ArrowForward, ArrowBack as ArrowBack, Edit, Download, Close } from '@mui/icons-material'  
import { TransitionProps } from '@mui/material/transitions'  
import { keyframes } from '@mui/system' 

// ========================
// Type Definitions
// ========================

export interface Image {
  src: string
  tags: string[]
}

export interface ImageCarouselRef {
  undo: () => void
}

interface ImageCarouselProps {
  images: Image[]
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  setIsImageEdited: React.Dispatch<React.SetStateAction<boolean>>
  setMaskedImageData: React.Dispatch<React.SetStateAction<string | null>>
  brushSize: number
  loading: boolean
}

// ========================
// Transition Component
// ========================

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

// ========================
// Animations
// ========================

const pulse = keyframes`
  0% {
    filter: blur(0px) 
  }
  50% {
    filter: blur(5px) 
  }
  100% {
    filter: blur(0px) 
  }
`

// ========================
// ImageCarousel Component
// ========================

const ImageCarousel = forwardRef<ImageCarouselRef, ImageCarouselProps>(
  (
    {
      images,
      setIsImageEdited,
      setMaskedImageData,
      setCurrentIndex,
      currentIndex,
      editMode,
      setEditMode,
      brushSize,
      loading
    },
    ref
  ) => {
    // ========================
    // State Management
    // ========================

    const [history, setHistory] = useState<string[]>([])
    const [isDrawing, setIsDrawing] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [modalImage, setModalImage] = useState<string | null>(null)

    // ========================
    // Refs
    // ========================

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)

    // ========================
    // Imperative Handle (Expose Undo)
    // ========================

    useImperativeHandle(ref, () => ({
      undo
    }))

    // ========================
    // Effects
    // ========================

    // Initialize Canvas for Editing
    useEffect(() => {
      if (editMode) {
        const initialState = images[currentIndex].src
        setHistory([initialState])

        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext('2d')
        if (!context) return

        // Set Canvas Dimensions
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        // Load and Draw Image
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = images[currentIndex].src
        img.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.drawImage(img, 0, 0, canvas.width, canvas.height)
          context.globalCompositeOperation = 'destination-out'
          context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
          context.lineWidth = brushSize
          context.lineCap = 'round'
          context.lineJoin = 'round'

          contextRef.current = context
        }
      }
    }, [editMode, currentIndex, images])

    // Update Brush Size
    useEffect(() => {
      if (editMode && contextRef.current) {
        contextRef.current.lineWidth = brushSize
      }
    }, [brushSize, editMode])

    // ========================
    // Navigation Handlers
    // ========================

    const handleNext = () => {
      const nextIndex = (currentIndex + 1) % images.length
      setCurrentIndex(nextIndex)
    }

    const handlePrev = () => {
      const prevIndex = (currentIndex - 1 + images.length) % images.length
      setCurrentIndex(prevIndex)
    }

    // ========================
    // Drawing Handlers
    // ========================

    const getEventCoords = (
      event:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      let clientX: number, clientY: number
      const canvas = canvasRef.current
      if (!canvas) return { offsetX: 0, offsetY: 0 }
      const rect = canvas.getBoundingClientRect()

      if ('touches' in event.nativeEvent) {
        clientX = event.nativeEvent.touches[0].clientX
        clientY = event.nativeEvent.touches[0].clientY
      } else {
        clientX = event.nativeEvent.clientX
        clientY = event.nativeEvent.clientY
      }
      const offsetX = clientX - rect.left
      const offsetY = clientY - rect.top
      return { offsetX, offsetY }
    }

    const startDrawing = (
      event:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      if (editMode) {
        const { offsetX, offsetY } = getEventCoords(event)
        contextRef.current!.beginPath()
        contextRef.current!.moveTo(offsetX, offsetY)
        setIsDrawing(true)
        setIsImageEdited(true)
      }
    }

    const draw = (
      event:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      if (!isDrawing) return
      const { offsetX, offsetY } = getEventCoords(event)
      contextRef.current!.lineTo(offsetX, offsetY)
      contextRef.current!.stroke()
    }

    const finishDrawing = () => {
      if (!editMode) return
      const canvas = canvasRef.current
      if (contextRef.current && canvas) {
        contextRef.current.closePath()
        const dataURL = canvas.toDataURL('image/png')
        setMaskedImageData(dataURL)
        console.log('Masked Image Data auto-saved:', dataURL)
        setHistory((prev) => [...prev, dataURL])
      }
      setIsDrawing(false)
    }

    // ========================
    // Image Saving and Downloading
    // ========================

    const saveEditedImage = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const dataURL = canvas.toDataURL('image/png')
      downloadImage(dataURL, 'edited_image.png')
      console.log('Masked Image Data:', dataURL)
    }

    const downloadImage = (dataUrl: string, filename: string) => {
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // ========================
    // Undo Functionality
    // ========================

    const undo = () => {
      setHistory((prevHistory) => {
        if (prevHistory.length > 1) {
          const newHistory = [...prevHistory]
          newHistory.pop()
          const previousState = newHistory[newHistory.length - 1]

          const canvas = canvasRef.current
          if (canvas) {
            const context = canvas.getContext('2d')
            if (context) {
              const img = new Image()
              img.src = previousState
              img.onload = () => {
                context.clearRect(0, 0, canvas.width, canvas.height)
                context.drawImage(img, 0, 0, canvas.width, canvas.height)
              }
            }
          }
          return newHistory
        }
        return prevHistory
      })
    }

    // ========================
    // Modal Handlers
    // ========================

    const openModal = () => {
      if (!editMode) {
        setModalImage(images[currentIndex].src)
        setIsModalOpen(true)
      }
    }

    const closeModal = () => {
      setIsModalOpen(false)
      setModalImage(null)
    }

    // ========================
    // Render
    // ========================

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          position: 'relative'
        }}
      >
        {/* Image Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '50vh',
            overflow: 'hidden',
            top: 0,
            left: 0
          }}
        >
          {/* Display Image or Canvas based on Edit Mode */}
          {!editMode ? (
            <Box
              component='img'
              src={images[currentIndex].src}
              alt={`Image ${currentIndex + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                cursor: 'pointer'
              }}
              onClick={openModal}
            />
          ) : (
            <canvas
              ref={canvasRef}
              style={{ cursor: 'crosshair' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={finishDrawing}
              onMouseOut={finishDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={finishDrawing}
            />
          )}

          {/* Loading Overlay */}
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: '#fff',
                zIndex: 10,
                textAlign: 'center',
                padding: '0 20px',
                animation: loading ? `${pulse} 5s infinite` : 'none',
                backdropFilter: loading ? 'blur(0px)' : 'none',
                transition: 'filter 0.3s ease, transform 0.3s ease'
              }}
            >
              {/* You can add loading indicators here if needed */}
            </Box>
          )}

          {/* Navigation Dots */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '0.5rem',
              zIndex: 10
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor:
                    index === currentIndex ? '#006FFD' : '#ffffff',
                  transition: 'background-color 0.3s ease'
                }}
              />
            ))}
          </Box>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              transform: 'translateY(-50%)',
              zIndex: 5,
              padding: '0 10px'
            }}
          >
            <IconButton
              onClick={handlePrev}
              sx={{
                color: '#fff',
                borderRadius: '50%'
              }}
            >
              <ArrowBack />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                color: '#fff',
                borderRadius: '50%'
              }}
            >
              <ArrowForward />
            </IconButton>
          </Box>

          {/* Edit Mode Controls */}
          {editMode && (
            <Box
              sx={{
                position: 'absolute',
                top: '5%',
                right: '5%',
                display: 'flex',
                gap: '0.6rem',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                padding: '4px 4px',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconButton
                sx={{ color: '#fff' }}
                onClick={() => setEditMode(false)}
              >
                <Close />
              </IconButton>
            </Box>
          )}

          {/* Action Buttons (Edit, Copy, Download) */}
          {!editMode && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                padding: '0.3rem 0.5rem',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Tooltip title='Edit'>
                <IconButton
                  sx={{ color: '#fff', height: '30px', width: '30px' }}
                  onClick={() => setEditMode(true)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Divider
                orientation='vertical'
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.5)', height: '24px' }}
              />
              <Tooltip title='Download'>
                <IconButton
                  sx={{ color: '#fff', height: '30px', width: '30px' }}
                  onClick={saveEditedImage}
                >
                  <Download />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Enlarged Image Modal */}
          <Dialog
            open={isModalOpen}
            onClose={closeModal}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            maxWidth='md'
            PaperProps={{
              style: {
                background: 'transparent',
                boxShadow: 'none'
              }
            }}
            BackdropProps={{
              sx: {
                backdropFilter: 'blur(5px)'
              }
            }}
          >
            <DialogContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 0
              }}
            >
              <img
                src={modalImage || ''}
                alt='Enlarged Image'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100vh',
                  borderRadius: '12px'
                }}
              />
            </DialogContent>
          </Dialog>
        </Box>
      </Box>
    )
  }
)

export default ImageCarousel
