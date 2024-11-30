import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Chip, Box, Button, Typography } from '@mui/material'
import { Character } from '../../types'
import { alex, eleanor, ethan, kumar, maya } from '../../assets/avatars'

const MeetTheCharacters: React.FC = () => {
  const { id } = useParams()
  const engagementId = id

  const navigate = useNavigate()

  const handleStartWorkshop = (): void => {
    navigate(`/image-workshop/${engagementId}`)
  }

  const characters: Character[] = [
    {
      id: 1,
      name: 'Mrs. Eleanor Tan',
      age: 72,
      description: 'Retired school teacher who enjoys gardening and community activities',
      tags: ['Accessibility', 'Proximity to Healthcare', 'Social Spaces', 'Safety'],
      avatar: eleanor,
    },
    {
      id: 2,
      name: 'Kumar and Priya',
      age: 35,
      description: 'Parents of two young children, working in tech and education',
      tags: ['Play Areas', 'Educational Facilities', 'Family-Friendly Amenities', 'Safety'],
      avatar: kumar,
    },
    {
      id: 3,
      name: 'Alex Wong',
      age: 28,
      description: 'Graphic designer who uses a wheelchair',
      tags: ['Accessibility', 'Supportive Infrastructure', 'Inclusive Design', 'Community Support'],
      avatar: alex,
    },
    {
      id: 4,
      name: 'Maya Chen',
      age: 30,
      description: 'Environmental scientist passionate about sustainability and green living',
      tags: ['Green Spaces', 'Public Transportation', 'Sustainability', 'Education & Awareness'],
      avatar: maya,
    },
    {
      id: 5,
      name: 'Ethan Lim',
      age: 22,
      description: 'Final-year computer science student balancing studies and part-time work',
      tags: ['Modern Amenities', 'Social Spaces', 'Sporting Facilities', 'Work-Study Balance'],
      avatar: ethan,
    }
  ]  

  return (
    <Box sx={styles.container}>
      {/* Header Section */}
      <Box sx={styles.header}>
        <Typography variant="h4" sx={styles.headerTitle}>
          Meet the Characters!
        </Typography>
        <Typography variant="body1" sx={styles.headerSubtitle}>
          Discover these unique characters, each bringing diverse experiences and insights into your creations.
        </Typography>
      </Box>

      {/* Character List */}
      {characters.map((character) => (
        <Box key={character.id} sx={styles.characterContainer}>
          {/* Avatar */}
          <Avatar src={character.avatar} alt={character.name} sx={styles.avatar} />

          {/* Text Content */}
          <Box sx={styles.textContent}>
            <Typography variant="h6" sx={styles.characterName}>
              {character.name}
            </Typography>
            <Typography variant="body2" sx={styles.description}>
              {character.description}
            </Typography>

            {/* Tags */}
            <Box sx={styles.tagsContainer}>
              {character.tags.map((tag, index) => (
                <Chip key={index} label={tag} sx={styles.tag} />
              ))}
            </Box>
          </Box>
        </Box>
      ))}

      {/* Start Workshop Button */}
      <Button variant="contained" onClick={handleStartWorkshop} sx={styles.button}>
        Start Image Workshop
      </Button>
    </Box>
  )
}

const styles = {
  container: {
    padding: '1.5rem',
    maxWidth: '600px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: '1.75rem',
  },
  headerSubtitle: {
    color: '#666',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  characterContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    padding: '1rem',
    borderRadius: '12px',
    width: '100%',
  },
  avatar: {
    width: '120px',
    height: '120px',
    marginRight: '1rem',
    borderRadius: '8px',
  },
  textContent: {
    flex: 1,
  },
  characterName: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  description: {
    color: '#666',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginBottom: '0.75rem',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tag: {
    backgroundColor: '#e0f0ff',
    color: '#000',
    fontSize: '0.8rem',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    textTransform: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '20px',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '2rem',
    '&:hover': {
      backgroundColor: '#005bb5',
    },
  },
}

export default MeetTheCharacters
