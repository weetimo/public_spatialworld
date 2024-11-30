import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material'
import { ageGroups } from '../../constants'
import { Gender, UserRole } from '../../enums'
import { useDatabase, useCurrentUser } from '../../hooks'

const UserParticulars = () => {
  const { id } = useParams()
  const engagementId = id

  const navigate = useNavigate()
  const { createData, updateData } = useDatabase()
  const { saveUser } = useCurrentUser()

  const [user, setUser] = useState({
    name: '',
    email: '',
    gender: '',
    ageGroup: '',
    postalCode: '',
    role: UserRole.USER
  })

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>): void => {
    setUser({ ...user, [field]: event.target.value })
  }

  const handleNext = async (): Promise<void> => {
    const generateRandomId = (): string => {
      return Math.random().toString(36).substring(2, 10)
    }
    const userId = generateRandomId()
    const userWithId = { ...user, id: userId }

    await createData(`users/${userId}`, userWithId)

    await updateData(`engagements/${engagementId}`, {
      userIds: { [userId]: true }
    })

    saveUser(userWithId)

    navigate(`/user-preferences/${engagementId}`)
  }

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" sx={styles.title}>
        Welcome!
      </Typography>
      <Typography variant="body1" sx={styles.subtitle}>
        Your personal information helps us better serve you!
      </Typography>

      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        value={user.name}
        onChange={handleChange('name')}
        sx={styles.input}
      />
      <TextField
        label="Email Address"
        variant="outlined"
        fullWidth
        value={user.email}
        onChange={handleChange('email')}
        sx={styles.input}
      />
      <TextField
        label="Gender"
        variant="outlined"
        fullWidth
        select
        value={user.gender}
        onChange={handleChange('gender')}
        sx={styles.input}
      >
        {Object.values(Gender).map((gender: Gender) => (
          <MenuItem key={gender} value={gender}>
            {gender}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Age Group"
        variant="outlined"
        fullWidth
        select
        value={user.ageGroup}
        onChange={handleChange('ageGroup')}
        sx={styles.input}
      >
        {ageGroups.map((group) => (
          <MenuItem key={group} value={group}>
            {group}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Postal Code"
        variant="outlined"
        fullWidth
        value={user.postalCode}
        onChange={handleChange('postalCode')}
        sx={styles.input}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleNext}
        sx={styles.nextButton}
      >
        Next
      </Button>
    </Box>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.5rem',
    margin: '0',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    boxSizing: 'border-box',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '2rem',
    color: '#333',
    alignSelf: 'flex-start'
  },
  subtitle: {
    color: '#a7a7a7',
    fontSize: '1rem',
    marginBottom: '1.5rem',
    alignSelf: 'flex-start'
  },
  input: {
    marginBottom: '1.2rem',
    width: '100%'
  },
  nextButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    textTransform: 'none',
    padding: '0.8rem',
    borderRadius: '0.6rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '1.5rem',
    '&:hover': {
      backgroundColor: '#005bb5',
    },
  },
}

export default UserParticulars
