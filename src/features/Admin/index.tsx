import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Paper, Box, Typography, TextField, IconButton, Button, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { v4 as uuid } from 'uuid'
import { useDatabase, useCloudinary } from '../../hooks'

interface Question {
  id: string;
  type: 'MULTI_ANSWERS' | 'FREE_RESPONSE';
  question: string;
  choices: string[];
}

const Admin: React.FC = () => {
  const navigate = useNavigate()
  const { createData, readData } = useDatabase()
  const { uploadImage } = useCloudinary()

  const [engagements, setEngagements] = useState<any[]>([])

  const [showTitleScreen, setShowTitleScreen] = useState(false)
  const [showContextScreen, setShowContextScreen] = useState(false)
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState(false)
  const [location, setLocation] = useState('')
  const [image, setImage] = useState<{ url: string; caption: string } | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showQuestionsScreen, setShowQuestionsScreen] = useState(false)
  const [showRestartDialog, setShowRestartDialog] = useState(false)

  const [questions, setQuestions] = useState<Question[]>([]);
  const [modalType, setModalType] = useState<'MULTI_ANSWERS' | 'FREE_RESPONSE' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({ id: '', type: 'MULTI_ANSWERS', question: '', choices: [] });
  const [questionModalOpen, setQuestionModalOpen] = useState(false);

  const stableReadData = useCallback(readData, [])

  useEffect(() => {
    const fetchEngagements = async () => {
      try {
        const data = await readData('engagements')
        if (data) {
          const engagementArray = Object.entries(data).map(([id, value]: [string, any]) => ({ id, ...value }))
          setEngagements(engagementArray)
        }
      } catch (error) {
        console.error('Error fetching engagements:', error)
      }
    }

    fetchEngagements()
  }, [stableReadData])

  const handleOpenTitleScreen = () => {
    setShowTitleScreen(true)
  }

  const handleDone = () => {
    if (!title.trim()) {
      setTitleError(true)
      return
    }
    setTitleError(false)
    setShowTitleScreen(false)
    setShowContextScreen(true)
  }

  const handleContextDone = () => {
    setShowContextScreen(false)
    setShowQuestionsScreen(true)
  }

  const handleUploadDone = () => {
    if (tempImage && caption) {
      setImage({ url: tempImage, caption });
      setUploadDialogOpen(false)
      setTempImage(null)
      setCaption('')
    }
  }

  const handleDeleteImage = () => {
    setImage(null)
  }

  const handleSaveToFirebase = async () => {
    const engagementId = uuid()

    const engagementData = {
      title,
      location,
      imageUrl: image?.url || 'https://res.cloudinary.com/dgfvymgcc/image/upload/v1732469193/garden0_r84x8n.jpg',
      imageCaption: image?.caption || ''
    }

    const questionnaireData = {
      id: engagementId,
      questions,
    }  

    try {
      await createData(`engagements/${engagementId}`, engagementData);
      console.log('Engagement saved successfully:', engagementData);

      await createData(`questionnaires/${engagementId}`, questionnaireData);
      console.log('Questionnaire saved successfully:', questionnaireData);
      
      navigate(`/admin_home/${engagementId}`)
    } catch (error) {
      console.error('Error saving engagement to Firebase:', error);
    }
  }

  const handleLogoClick = () => {
    if (showTitleScreen || showContextScreen || showQuestionsScreen) {
      setShowRestartDialog(true)
    } else {
      window.location.reload()
    }
  }

  const handleRestartConfirm = () => {
    setShowRestartDialog(false)
    window.location.reload()
  }

  const handleAddQuestion = () => {
    if (modalType === 'MULTI_ANSWERS' && currentQuestion.question.trim() && currentQuestion.choices.length > 0) {
      setQuestions((prev) => [
        ...prev,
        {
          id: `q${questions.length + 1}`,
          type: modalType,
          question: currentQuestion.question,
          choices: [...currentQuestion.choices],
        },
      ])
    } else if (modalType === 'FREE_RESPONSE' && currentQuestion.question.trim()) {
      setQuestions((prev) => [
        ...prev,
        {
          id: `q${questions.length + 1}`,
          type: modalType,
          question: currentQuestion.question,
          choices: [],
        },
      ])
    }
    setCurrentQuestion({ id: '', type: 'MULTI_ANSWERS', question: '', choices: [] })
    setQuestionModalOpen(false)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const cloudinaryUrl = await uploadImage(file)
      if (cloudinaryUrl) {
        setTempImage(cloudinaryUrl)
        setUploadDialogOpen(true)
      } else {
        console.error('Failed to retrieve Cloudinary URL')
      }
    } catch (err) {
      console.error('Error during image upload:', err)
    }
  }
  

  if (showTitleScreen) {
    return (
      <Box sx={{ padding: '2rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={handleLogoClick}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '4px'
              }
            }}
          >
            <img
              src='https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png'
              alt='URA Logo'
              style={{ height: '80px' }}
            />
          </IconButton>
          <Typography variant='h5'>Public Engagement Dashboard</Typography>
        </Box>

        <Box sx={{ 
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 auto',
          mt: 8
        }}>
          <Typography variant='h3' sx={{ mb: 6 }}>Let's start with a title and location</Typography>
          <TextField
            autoFocus
            fullWidth
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setTitleError(false)
            }}
            placeholder="Type here"
            variant="standard"
            sx={{ 
              mb: 2,
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 1
              },
              '& .MuiInputBase-input': {
                color: 'text.primary'
              },
              '& input': {
                color: 'text.primary'
              },
              '& .MuiInput-underline:before': {
                borderBottomColor: 'text.secondary'
              }
            }}
            error={titleError}
            InputProps={{
              style: { color: 'inherit' }
            }}
          />
          <TextField
            autoFocus
            fullWidth
            value={location}
            onChange={(e) => {
              setLocation(e.target.value)
            }}
            placeholder="Input the Google Maps link of the engagement session location"
            variant="standard"
            sx={{ 
              mb: 2,
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 1
              },
              '& .MuiInputBase-input': {
                color: 'text.primary'
              },
              '& input': {
                color: 'text.primary'
              },
              '& .MuiInput-underline:before': {
                borderBottomColor: 'text.secondary'
              }
            }}
            error={titleError}
            InputProps={{
              style: { color: 'inherit' }
            }}
          />
          {titleError && (
            <Typography color="error" sx={{ mb: 4, alignSelf: 'flex-start' }}>
              Please enter a title for the engagement session.
            </Typography>
          )}
          <Button 
            onClick={handleDone}
            variant="contained"
            sx={{
              borderRadius: '20px',
              px: 6,
              py: 1,
              textTransform: 'none'
            }}
          >
            Done
          </Button>
        </Box>

        <Dialog open={showRestartDialog} onClose={() => setShowRestartDialog(false)}>
          <DialogTitle>Restart Session?</DialogTitle>
          <DialogContent>
            <Typography>
              Your progress will be lost if you restart. Are you sure you want to continue?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRestartDialog(false)}>Cancel</Button>
            <Button onClick={handleRestartConfirm} color="error">
              Restart
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  }

  if (showContextScreen) {
    return (
      <Box sx={{ padding: '2rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={handleLogoClick}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '4px'
              }
            }}
          >
            <img
              src='https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png'
              alt='URA Logo'
              style={{ height: '80px' }}
            />
          </IconButton>
          <Typography variant='h5'>Public Engagement Dashboard</Typography>
        </Box>

        <Box sx={{ 
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mt: 8,
          ml: 4
        }}>
          <Typography variant='h3' sx={{ mb: 6, maxWidth: '100%', width: '100%', whiteSpace: 'normal', wordWrap: 'break-word' }}>
            Great! Now let's provide some contextual information for the participants!
          </Typography>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            width: '100%',
          }}>
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                width: '400px',
                height: '250px',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                display: image ? 'none' : 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
              <AddCircleOutlineIcon sx={{ fontSize: '40px', color: 'grey', mb: 2 }} />
              <Typography variant='h6'>Upload Image</Typography>
            </Box>

            <Box
              sx={{
                width: '400px',
                height: '250px',
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                display: image ? 'block' : 'none',
                '&:hover .caption-overlay': {
                  display: 'flex',
                }
              }}
            >
              <img
                src={image?.url}
                alt={`Upload`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                className="caption-overlay"
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  display: 'none',
                  padding: '1rem',
                  textAlign: 'left',
                  height: 'auto',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography sx={{ 
                  ml: 1,
                  fontSize: '1rem',
                  flex: 1,
                }}>
                  {image?.caption}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage();
                  }}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Button 
            variant="contained"
            onClick={handleContextDone}
            disabled={!image}
            sx={{
              borderRadius: '20px',
              px: 6,
              py: 1,
              textTransform: 'none',
              mt: 4,
              opacity: !image ? 0.5 : 1
            }}
          >
            Next
          </Button>
        </Box>

        <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
          <DialogContent>
            {tempImage && (
              <img
                src={tempImage}
                alt="Upload preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  marginBottom: '1rem'
                }}
              />
            )}
            <TextField
              fullWidth
              multiline
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a description for this image..."
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadDone} variant="contained" disabled={!caption}>
              Done
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showRestartDialog} onClose={() => setShowRestartDialog(false)}>
          <DialogTitle>Restart Session?</DialogTitle>
          <DialogContent>
            <Typography>
              Your progress will be lost if you restart. Are you sure you want to continue?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRestartDialog(false)}>Cancel</Button>
            <Button onClick={handleRestartConfirm} color="error">
              Restart
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  }

  if (showQuestionsScreen) {
    return (
      <Box sx={{ padding: '2rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={handleLogoClick}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '4px'
              }
            }}
          >
            <img
              src='https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png'
              alt='URA Logo'
              style={{ height: '80px' }}
            />
          </IconButton>
          <Typography variant='h5'>Public Engagement Dashboard</Typography>
        </Box>

        <Dialog open={questionModalOpen} onClose={() => setQuestionModalOpen(false)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Question"
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="Enter the question"
              margin="normal"
            />
            {modalType === 'MULTI_ANSWERS' && (
              <>
                {currentQuestion.choices.map((choice: string, idx: number) => (
                  <Box key={idx} display="flex" alignItems="center" gap={2} mb={2}>
                    <TextField
                      fullWidth
                      value={choice}
                      onChange={(e) =>
                        setCurrentQuestion((prev) => {
                          const updatedChoices = [...prev.choices];
                          updatedChoices[idx] = e.target.value;
                          return { ...prev, choices: updatedChoices };
                        })
                      }
                      placeholder={`Choice ${idx + 1}`}
                    />
                    <Button
                      onClick={() =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          choices: prev.choices.filter((_, i: number) => i !== idx),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button
                  onClick={() =>
                    setCurrentQuestion((prev) => ({
                      ...prev,
                      choices: [...prev.choices, ''],
                    }))
                  }
                >
                  Add Choice
                </Button>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQuestionModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddQuestion} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ 
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mt: 8,
          ml: 4
        }}>
          <Typography variant='h3' sx={{ mb: 6 }}>
            Add questions you'd like to ask the participants!
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => {
                setModalType('MULTI_ANSWERS');
                setQuestionModalOpen(true);
              }}
              sx={{
                borderRadius: '20px',
                py: 2,
                px: 4,
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px'
                }
              }}
            >
              Multiple Choice Question
            </Button>

            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => {
                setModalType('FREE_RESPONSE');
                setQuestionModalOpen(true);
              }}
              sx={{
                borderRadius: '20px',
                py: 2,
                px: 4,
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px'
                }
              }}
            >
              Open Ended Question
            </Button>
          </Box>

          <Box mt={4}>
            {questions.map((q, index: number) => (
              <Paper
                key={index}
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  p: 3,
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: 'white',
                  margin: '0 auto',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography variant="h6" mb={2}>
                  {q.question}
                </Typography>
                {q.type === 'MULTI_ANSWERS' && (
                  <Box>
                    <Typography variant="body1" fontWeight="bold" mb={1}>
                      Choices:
                    </Typography>
                    <ul>
                      {(q as Question).choices.map((choice: string, idx: number) => (
                        <li key={idx}>
                          <Typography variant="body2">{choice}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
                <Button
                  variant="contained"
                  color="error"
                  onClick={() =>
                    setQuestions((prev) => prev.filter((_, i: number) => i !== index))
                  }
                  sx={{
                    mt: 2,
                    textTransform: 'none',
                  }}
                >
                  Delete Question
                </Button>
              </Paper>
            ))}
          </Box>

          <Box sx={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
            <Button
              variant="contained"
              sx={{
                borderRadius: '20px',
                px: 6,
                py: 1,
                textTransform: 'none'
              }}
              onClick={(event) => {
                event.preventDefault()
                handleSaveToFirebase()
              }}
            >
              Next
            </Button>
          </Box>
        </Box>

        <Dialog open={showRestartDialog} onClose={() => setShowRestartDialog(false)}>
          <DialogTitle>Restart Session?</DialogTitle>
          <DialogContent>
            <Typography>
              Your progress will be lost if you restart. Are you sure you want to continue?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRestartDialog(false)}>Cancel</Button>
            <Button onClick={handleRestartConfirm} color="error">
              Restart
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ padding: '2rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={handleLogoClick}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '4px'
              }
            }}
          >
            <img
              src='https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png'
              alt='URA Logo'
              style={{ height: '80px' }}
            />
          </IconButton>
          <Typography variant='h5'>Public Engagement Dashboard</Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}
        >
          {/* Map Engagements */}
          {engagements?.map((engagement) => (
            <Box
              key={engagement.id}
              onClick={() => navigate(`/admin_home/${engagement.id}`)}
              sx={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                }
              }}
            >
              <img
                src={engagement.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={engagement.title || 'Engagement'}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  {engagement.title}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {engagement.imageCaption || 'No caption provided'}
                </Typography>
              </Box>
            </Box>
          ))}

          <Button
            onClick={handleOpenTitleScreen}
            sx={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              },
              height: '100%'
            }}
          >
            <AddCircleOutlineIcon sx={{ fontSize: '40px', color: 'lightgrey' }} />
            <Typography variant='button' sx={{ color: 'black', mt: 1 }}>
              Create New Engagement Session
            </Typography>
          </Button>
        </Box>

        <Dialog open={showRestartDialog} onClose={() => setShowRestartDialog(false)}>
          <DialogTitle>Restart Session?</DialogTitle>
          <DialogContent>
            <Typography>
              Your progress will be lost if you restart. Are you sure you want to continue?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRestartDialog(false)}>Cancel</Button>
            <Button onClick={handleRestartConfirm} color="error">
              Restart
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default Admin
