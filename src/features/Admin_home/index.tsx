import React, { useState } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { Home, MessageSquare, ImagePlus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import HomeContent from './HomeContent'
import QnaContent from './QnaContent'
import ImageContent from './ImageContent'

const Admin_home: React.FC = () => {
  const { id } = useParams()
  const engagementId = id

  const [activeTab, setActiveTab] = useState('home')
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: '280px',
          minWidth: '280px',
          maxWidth: '280px',
          backgroundColor: 'white',
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2,
          flexSrink: 0
        }}
      >
        {/* Logo and Title Container */}
        <Box
          sx={{
            padding: '1rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            minHeight: '80px'
          }}
        >
          <IconButton
            onClick={() => navigate('/Admin')}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.05)'
              },
              padding: '4px'
            }}
          >
            <img
              src='https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png'
              alt='URA Logo'
              style={{ height: '60px', width: 'auto' }}
            />
          </IconButton>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ padding: '1rem', flexGrow: 1, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box
              onClick={() => setActiveTab('home')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor:
                  activeTab === 'home' ? '#fee2e2' : 'transparent',
                color: activeTab === 'home' ? '#dc2626' : 'inherit',
                '&:hover': {
                  backgroundColor: activeTab === 'home' ? '#fee2e2' : '#f3f4f6'
                }
              }}
            >
              <Home size={20} style={{ marginRight: '12px' }} />
              <Typography>Home</Typography>
            </Box>

            <Box
              onClick={() => setActiveTab('qa')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: activeTab === 'qa' ? '#fee2e2' : 'transparent',
                color: activeTab === 'qa' ? '#dc2626' : 'inherit',
                '&:hover': {
                  backgroundColor: activeTab === 'qa' ? '#fee2e2' : '#f3f4f6'
                }
              }}
            >
              <MessageSquare size={20} style={{ marginRight: '12px' }} />
              <Typography>Q&A</Typography>
            </Box>

            <Box
              onClick={() => setActiveTab('ai')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: activeTab === 'ai' ? '#fee2e2' : 'transparent',
                color: activeTab === 'ai' ? '#dc2626' : 'inherit',
                '&:hover': {
                  backgroundColor: activeTab === 'ai' ? '#fee2e2' : '#f3f4f6'
                }
              }}
            >
              <ImagePlus size={20} style={{ marginRight: '12px' }} />
              <Typography>AI Image Generations</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: 'white',
          overflow: 'hidden',
          minWidth: 0
        }}
      >
        {/* Scrollable Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            padding: '2rem',
            overflow: 'auto',
            minWidth: 0
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              width: '100%',
              maxWidth: '100%'
            }}
          >
            {activeTab === 'home' && <HomeContent engagementId={engagementId} />}
            {activeTab === 'qa' && <QnaContent engagementId={engagementId} />}
            {activeTab === 'ai' && <ImageContent engagementId={engagementId} />}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Admin_home
