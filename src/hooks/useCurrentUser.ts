import { useState, useEffect } from 'react'
import { User } from '../types'

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  const saveUser = (user: User) => {
    localStorage.setItem('currentUser', JSON.stringify(user))
    setCurrentUser(user)
  }

  const clearUser = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null);
  }

  return { currentUser, saveUser, clearUser }
}

export default useCurrentUser
