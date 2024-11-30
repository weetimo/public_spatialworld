import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import { Download, Settings } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import ReactWordcloud from 'react-d3-cloud'
import { exportToCSV, demographicsData, regionData, word_cloud } from './utils'
import { useDatabase } from '../../../hooks'

interface Generation {
  prompt: string;
  originalPrompt?: string;
}

const HomeContent: React.FC<{ engagementId: string }> = ({ engagementId }) => {
  const { readData } = useDatabase()

  const [engagementData, setEngagementData] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [generations, setGenerations] = useState<Generation[]>([])

  const [wordCloudData, setWordCloudData] = useState<
    Array<{ text: string; value: number }>
  >([])
  const [heatmapImageUrl, setHeatmapImageUrl] = useState<string>('')
  const [communityImageUrl, setCommunityImageUrl] = useState<string>('')

  const [openWordCloudSettings, setOpenWordCloudSettings] = useState(false)
  const [wordCloudGender, setWordCloudGender] = useState('male')
  const [wordCloudAge, setWordCloudAge] = useState([20, 35])
  const [showHeatMap, setShowHeatMap] = useState(false)
  const [showGeneratedImage, setShowGeneratedImage] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState([20, 35])

  const stableReadData = useCallback(readData, [])

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const data = await readData('users')
        if (data) {
          const usersArray = Object.entries(data)
            .map(([id, user]) => ({ id, ...user }))
            .filter(
              (user) => user.preferences?.questionnaireId === engagementId
            )
          setParticipants(usersArray)
        }
      } catch (error) {
        console.error('Error fetching participants:', error)
      }
    }

    fetchParticipants()
  }, [stableReadData])

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const data = await readData(`engagements/${engagementId}`)
        setEngagementData(data)
      } catch (error) {
        console.error('Error fetching engagement data:', error)
      }
    }

    const fetchGenerations = async () => {
      try {
        const data = await readData(`generations/${'5920582525'}`)
        const generationsArray = Object.values(data)
        setGenerations(generationsArray)
        console.log('generations:', generationsArray)

        const cloud = word_cloud(generationsArray)
        console.log('cloud:', cloud)
        setWordCloudData(cloud)
      } catch (error) {
        console.error('Error fetching generations data:', error)
      }
    }

    if (engagementId) {
      fetchEngagement()
      fetchGenerations()
    }
  }, [engagementId, stableReadData])

  const generateHeatMap = async () => {
    try {
      const response = await fetch('/api/generateHeatMap') // TODO: Change to actual API
      const data = await response.json()
      setHeatmapImageUrl(data.url)
      setShowHeatMap(true)
    } catch (error) {
      console.error('Error generating heat map:', error)
    }
  }

  const generateCommunityImage = async () => {
    try {
      const response = await fetch('/api/generateCommunityImage') // TODO: Change to actual API
      const data = await response.json()
      setCommunityImageUrl(data.url)
      setShowGeneratedImage(true)
    } catch (error) {
      console.error('Error generating community image:', error)
    }
  }

  const handleGenderChange = (
    _event: React.MouseEvent<HTMLElement>,
    newGender: string | null
  ) => {
    if (newGender !== null) {
      setGender(newGender)
    }
  }
  const handleAgeChange = (_event: Event, newValue: number | number[]) => {
    setAge(newValue as number[])
  }

  const handleWordCloudGenderChange = (
    _event: React.MouseEvent<HTMLElement>,
    newGender: string | null
  ) => {
    if (newGender !== null) {
      setWordCloudGender(newGender)
    }
  }

  const handleWordCloudAgeChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    setWordCloudAge(newValue as number[])
  }

  // Settings Dialog Component
  const SettingsDialog = () => (
    <Dialog
      open={openSettings}
      onClose={() => setOpenSettings(false)}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          width: '400px'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>Gender</Typography>
          <ToggleButtonGroup
            value={gender}
            exclusive
            onChange={handleGenderChange}
            aria-label='gender selection'
            sx={{ width: '100%' }}
          >
            <ToggleButton
              value='male'
              aria-label='male'
              sx={{
                flex: 1,
                borderRadius: '20px',
                '&.Mui-selected': {
                  backgroundColor: '#f3f4f6'
                }
              }}
            >
              Male
            </ToggleButton>
            <ToggleButton
              value='female'
              aria-label='female'
              sx={{
                flex: 1,
                borderRadius: '20px',
                '&.Mui-selected': {
                  backgroundColor: '#f3f4f6'
                }
              }}
            >
              Female
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>Age</Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={age}
              onChange={handleAgeChange}
              valueLabelDisplay='on'
              min={0}
              max={100}
              sx={{
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                  border: '2px solid #9ca3af'
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#9ca3af'
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#e5e7eb'
                }
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={() => setOpenSettings(false)}
          variant='contained'
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            backgroundColor: 'black',
            '&:hover': {
              backgroundColor: '#374151'
            }
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )

  // Word Cloud Settings Dialog Component
  const WordCloudSettingsDialog = () => (
    <Dialog
      open={openWordCloudSettings}
      onClose={() => setOpenWordCloudSettings(false)}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          width: '400px'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>Gender</Typography>
          <ToggleButtonGroup
            value={wordCloudGender}
            exclusive
            onChange={handleWordCloudGenderChange}
            aria-label='gender selection'
            sx={{ width: '100%' }}
          >
            <ToggleButton
              value='male'
              aria-label='male'
              sx={{
                flex: 1,
                borderRadius: '20px',
                '&.Mui-selected': {
                  backgroundColor: '#f3f4f6'
                }
              }}
            >
              Male
            </ToggleButton>
            <ToggleButton
              value='female'
              aria-label='female'
              sx={{
                flex: 1,
                borderRadius: '20px',
                '&.Mui-selected': {
                  backgroundColor: '#f3f4f6'
                }
              }}
            >
              Female
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>Age</Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={wordCloudAge}
              onChange={handleWordCloudAgeChange}
              valueLabelDisplay='on'
              min={0}
              max={100}
              sx={{
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                  border: '2px solid #9ca3af'
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#9ca3af'
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#e5e7eb'
                }
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={() => setOpenWordCloudSettings(false)}
          variant='contained'
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            backgroundColor: 'black',
            '&:hover': {
              backgroundColor: '#374151'
            }
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <Box>
      {/* Title and Subtitle Section */}
      <Box sx={{ marginBottom: 4 }}>
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
          Engagement Session Overview
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
          Provides insights and community data from the engagement session.
        </Typography>
      </Box>
      {/* Participants Section */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant='h6'
          sx={{
            mb: 2,
            fontWeight: 500,
            fontSize: '1.1rem',
            color: '#6B7280'
          }}
        >
          Participants
        </Typography>
        <Typography
          variant='h6'
          sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
        >
          Participants List
        </Typography>
        <Box
          sx={{
            backgroundColor: 'white',
            p: 2,
            borderRadius: '8px',
            height: '400px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 3
            }}
          >
            <Button
              onClick={() => exportToCSV(participants)}
              startIcon={<Download size={18} />}
              variant='outlined'
              sx={{ borderRadius: '8px' }}
            >
              Export to CSV
            </Button>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: '0 2px 3px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              height: 'calc(100% - 60px)',
              overflow: 'auto'
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Age Group</TableCell>
                  <TableCell>Postal Code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.email}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: '16px',
                          backgroundColor:
                            participant.gender === 'MALE'
                              ? '#e0f2fe'
                              : '#fce7f3',
                          color:
                            participant.gender === 'MALE'
                              ? '#0369a1'
                              : '#be185d'
                        }}
                      >
                        {participant.gender}
                      </Box>
                    </TableCell>
                    <TableCell>{participant.ageGroup}</TableCell>
                    <TableCell>{participant.postalCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Location and Participants side by side */}
      {/* Demographics Section moved to side layout */}
      <Box sx={{ display: 'flex', gap: 4, mt: 6 }}>
        {/* Location Section */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant='h6'
            sx={{
              mb: 2,
              fontWeight: 500,
              fontSize: '1.1rem',
              color: '#6B7280'
            }}
          >
            Location
          </Typography>
          <Typography
            variant='h6'
            sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
          >
            Regions
          </Typography>

          <Box sx={{ display: 'flex', gap: 4 }}>
            {/* Pie Chart */}
            <Box sx={{ width: '300px', height: '300px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={regionData(participants)}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={100}
                  >
                    {regionData(participants).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Legend */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                justifyContent: 'center'
              }}
            >
              {regionData(participants).map((region) => (
                <Box
                  key={region.name}
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: region.color
                    }}
                  />
                  <Typography>{region.name}</Typography>
                  <Typography sx={{ color: '#6B7280' }}>
                    {region.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Demographics Section */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant='h6'
            sx={{
              mb: 2,
              fontWeight: 500,
              fontSize: '1.1rem',
              color: '#6B7280'
            }}
          >
            Demographics
          </Typography>
          <Typography
            variant='h6'
            sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
          >
            Age & Gender
          </Typography>
          <Box sx={{ height: '300px' }}>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                layout='vertical'
                data={demographicsData(participants)}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type='number' />
                <YAxis dataKey='age' type='category' interval={0} />
                <Tooltip
                  cursor={false}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null

                    const colors = {
                      male: '#ef4444',
                      female: '#f97316'
                    }

                    return (
                      <div
                        style={{
                          backgroundColor: 'white',
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      >
                        {payload.map((item) => (
                          <div
                            key={item.name}
                            style={{
                              color: colors[item.name as keyof typeof colors]
                            }}
                          >
                            {item.name}: {item.value}
                          </div>
                        ))}
                      </div>
                    )
                  }}
                />
                <Legend />
                <Bar
                  dataKey='male'
                  name='Male'
                  fill='#ef4444'
                  stackId='stack'
                  barSize={30}
                />
                <Bar
                  dataKey='female'
                  name='Female'
                  fill='#f97316'
                  stackId='stack'
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>

      {/* New Image Section */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant='h6'
          sx={{ mb: 2, fontWeight: 500, fontSize: '1.1rem', color: '#6B7280' }}
        >
          In-painting
        </Typography>
        <Typography
          variant='h6'
          sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
        >
          Image
        </Typography>
        {/* Image Container */}
        <Box
          sx={{
            position: 'relative',
            width: '800px', // Add this line to set fixed width
            margin: '0 auto', // Add this to center the container
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          {/* Base Image */}
          <img
            src={engagementData?.imageUrl}
            alt='Base area'
            style={{
              width: '800px', // Add this line to set fixed width
              margin: '0 auto', // Add this to center the container
              height: 'auto',
              borderRadius: '8px',
              display: 'block'
            }}
          />

          {/* Heat Map Overlay - Only shown when showHeatMap is true */}
          {showHeatMap && (
            <img
              src={heatmapImageUrl}
              alt='Heat map overlay'
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.7,
                borderRadius: '8px'
              }}
            />
          )}
        </Box>
        {/* Toggle Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant='outlined'
            onClick={generateHeatMap}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '150px'
            }}
          >
            Overlay Heat-map
          </Button>
        </Box>
      </Box>
      {/* Community Generation Section */}
      <Box sx={{ mt: 6 }}>
        {/* Header with Settings */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography
              variant='h6'
              sx={{
                mb: 2,
                fontWeight: 500,
                fontSize: '1.1rem',
                color: '#6B7280'
              }}
            >
              Community Generation
            </Typography>
            <Typography
              variant='h6'
              sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
            >
              Image
            </Typography>
          </Box>
          <Button
            startIcon={<Settings size={24} />}
            variant='text'
            onClick={() => setOpenSettings(true)}
            sx={{
              color: '#6B7280',
              minWidth: 'unset',
              p: 1
            }}
          ></Button>
        </Box>

        {/* Image Container */}
        <Box
          sx={{
            position: 'relative',
            width: '800px', // Add this line to set fixed width
            margin: '0 auto', // Add this to center the container
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          {/* Show image only when generated */}
          {showGeneratedImage ? (
            <img
              src={communityImageUrl}
              alt='Generated community'
              style={{
                width: '100%',
                aspectRatio: '16/9', // Maintains consistent height ratio
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                aspectRatio: '16/9', // Maintains consistent height ratio
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px'
              }}
            >
              <Typography sx={{ color: '#6B7280', mb: 2 }}>
                Community Image Here
              </Typography>
            </Box>
          )}
        </Box>

        {/* Generate Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant='contained'
            onClick={generateCommunityImage}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '150px',
              backgroundColor: 'white',
              color: 'black',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#f3f4f6'
              }
            }}
          >
            Generate Image
          </Button>
        </Box>
      </Box>
      <SettingsDialog />
      {/* Word Cloud Section */}
      <Box sx={{ mt: 6 }}>
        {/* Header with Settings */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography
              variant='h6'
              sx={{
                mb: 2,
                fontWeight: 500,
                fontSize: '1.1rem',
                color: '#6B7280'
              }}
            >
              Word-cloud
            </Typography>
            <Typography
              variant='h6'
              sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
            >
              Most Popular Topics
            </Typography>
          </Box>
          <Button
            startIcon={<Settings size={24} />}
            variant='text'
            onClick={() => setOpenWordCloudSettings(true)}
            sx={{
              color: '#6B7280',
              minWidth: 'unset',
              p: 1
            }}
          />
        </Box>

        {/* Word Cloud Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '400px',
            borderRadius: '8px',
            backgroundColor: 'white',
            p: 2
          }}
        >
          <ReactWordcloud
            data={wordCloudData}
            // fontSize={(word) => 10 + Math.pow(word.value, 3) * 1.5}
            fontSize={(word) => 10 + Math.pow(word.value, 2) * 1.4}
            font='impact'
            rotate={0}
            padding={5}
            width={1200}
            height={350}
            spiral='archimedean'
            fill={(_word: any, index: number) =>
              ['#0d47a1', '#2e7d32', '#ef4444', '#f97316'][index % 4]
            }
          />
        </Box>
      </Box>
      <WordCloudSettingsDialog />
    </Box>
  )
}

export default HomeContent
