import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Typography, IconButton, Avatar } from '@mui/material'
import { ArrowBack, Favorite, FavoriteBorder } from '@mui/icons-material'
import { useDatabase, useCurrentUser } from '../../hooks'

const FeedDetail: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const { readData, updateData } = useDatabase()

  const post = location.state?.post

  const { userId, imageUrl, upscaledPrompt, voters: initialVoters = [] } = post

  const [likes, setLikes] = useState<number>(initialVoters.length)
  const [liked, setLiked] = useState<boolean>(initialVoters.includes(currentUser?.id || ''))
  const [voters, setVoters] = useState<string[]>(initialVoters)
  const [userName, setUserName] = useState<string>('Unknown User')

  useEffect(() => {
    if (currentUser?.id) {
      setLiked(voters.includes(currentUser.id))
    }
  }, [voters, currentUser?.id])

  const stableReadData = useCallback(readData, [])

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = await readData(`users/${userId}`)
        if (user) setUserName(user.name)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserName()
  }, [userId, stableReadData])

  const handleLike = async () => {
    const userId = currentUser?.id
    if (!userId) return

    const updatedVoters = liked
      ? voters.filter((id) => id !== userId)
      : [...voters, userId]

    setLiked(!liked)
    setLikes(updatedVoters.length)
    setVoters(updatedVoters)

    try {
      await updateData(`generations/${post.engagementId}/${post.userId}`, { voters: updatedVoters })
      console.log('Voters updated successfully')
    } catch (error) {
      console.error('Error updating voters:', error)
    }
  }

  return (
    <Box sx={styles.container}>
      {/* Back Button */}
      <IconButton onClick={() => navigate('/feed')} sx={styles.backButton}>
        <ArrowBack />
      </IconButton>

      {/* Image */}
      <Box
        component="img"
        src={imageUrl}
        alt="Generated Image"
        sx={styles.image}
      />

      {/* User Info */}
      <Box sx={styles.userInfo}>
        <Avatar alt={userName} sx={styles.avatar} />
        <Typography variant="subtitle1" sx={styles.userName}>
          {userName}
        </Typography>
      </Box>

      {/* Description */}
      <Typography variant="body2" sx={styles.description}>
        {upscaledPrompt}
      </Typography>

      {/* Stats */}
      <Box sx={styles.statsContainer}>
        <Box sx={styles.statItem}>
          <IconButton onClick={handleLike} sx={styles.heartButton}>
            {liked ? (
              <Favorite sx={styles.heartIconLiked} />
            ) : (
              <FavoriteBorder sx={styles.heartIcon} />
            )}
          </IconButton>
          <Typography variant="body2" sx={styles.statText}>
            {likes}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

const styles = {
  container: {
    backgroundColor: '#f0f4ff',
    padding: '1.5rem',
    height: '100vh',
  },
  image: {
    height: '350px',
    width: '100%',
    borderRadius: '1.2rem',
    marginBottom: '1.5rem',
    marginTop: '1rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '0.5rem',
  },
  avatar: {
    width: '50px',
    height: '50px',
    marginRight: '1rem',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: '1.25rem',
    color: '#333',
  },
  description: {
    color: '#666',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    padding: '0.5rem',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '1.2rem',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  heartButton: {
    padding: 0,
  },
  heartIcon: {
    color: '#ccc',
    fontSize: '1.5rem',
  },
  heartIconLiked: {
    color: '#000',
    fontSize: '1.5rem',
  },
  statText: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#333',
  }
}

export default FeedDetail
