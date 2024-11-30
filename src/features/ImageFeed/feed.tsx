import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Box, Typography, IconButton, Avatar } from '@mui/material'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { useDatabase, useCurrentUser } from '../../hooks'

const Feed = () => {
  const { id } = useParams()
  const engagementId = id

  const { readData, updateData } = useDatabase()
  const { currentUser } = useCurrentUser()

  const [posts, setPosts] = useState<any[]>([])
  const [users, setUsers] = useState<{ [userId: string]: string }>({})

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await readData(`generations/${engagementId}`)
        if (data) {
          const postsArray = Object.entries(data).map(([id, post]) => ({ id, ...post }))
          setPosts(postsArray)

          const userIds = Array.from(new Set(postsArray.map((post) => post.userId)))

          const usersData: { [userId: string]: string } = {}
          await Promise.all(
            userIds.map(async (userId) => {
              const user = await readData(`users/${userId}`)
              if (user) usersData[userId] = user.name
            })
          )
          setUsers(usersData)
        }
      } catch (error) {
        console.error('Error fetching posts or user data:', error)
      }
    }

    fetchPosts()
  }, [engagementId])

  const handleLike = async (postId: string, voters: string[]) => {
    const userId = currentUser?.id
    if (!userId) return

    const updatedVoters = voters.includes(userId)
      ? voters.filter((id) => id !== userId)
      : [...voters, userId]

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.userId === postId ? { ...post, voters: updatedVoters } : post
      )
    )

    try {
      await updateData(`generations/${engagementId}/${postId}`, { voters: updatedVoters })
      console.log('Voters updated successfully')
    } catch (error) {
      console.error('Error updating voters:', error)
    }
  }

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.headerTitle}>
          Explore Feeds
        </Typography>
        <Typography variant="body2" sx={styles.headerSubtitle}>
          Explore other residents&apos thoughts and ideas of redesigning!
        </Typography>
      </Box>

      {/* Feed Content */}
      <Box sx={styles.content}>
        {posts.map((post) => (
          <Link to={`/feed/${engagementId}/${post.userId}`} key={post.id} state={{ post }} style={styles.link}>
            <Box sx={styles.postContainer}>
              <Box sx={styles.userInfo}>
                <Avatar src={post.user?.avatar} alt={users[post.userId] || 'Unknown User'} sx={styles.avatar} />
                <Typography variant="subtitle1" sx={styles.userName}>
                  {users[post.userId] || 'Unknown User'}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.preventDefault()
                    handleLike(post.userId, post.voters || [])
                  }}
                  sx={styles.heartButton}
                >
                  {post.voters?.includes(currentUser?.id) ? (
                    <Favorite sx={styles.heartIconLiked} />
                  ) : (
                    <FavoriteBorder sx={styles.heartIcon} />
                  )}
                </IconButton>
              </Box>

              <Box
                component="img"
                src={post.imageUrl}
                alt="Post"
                sx={styles.postImage}
              />
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f0f4ff',
    boxSizing: 'border-box',
    width: '100%',
    alignItems: 'center',
    margin: '0',
    justifyContent: 'center',
  },
  header: {
    marginBottom: '1rem',
    padding: '1.5rem',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: '#333',
  },
  headerSubtitle: {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    background: '#fff',
    width: '100%',
    paddingTop: '1.5rem',
    paddingBottom: '2.5rem',
    borderTopLeftRadius: '2rem',
    borderTopRightRadius: '2rem',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  postContainer: {
    borderRadius: '12px',
    padding: '0.5rem 2.5rem',
    marginBottom: '0rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    marginRight: '0.75rem',
  },
  userName: {
    fontWeight: 'bold',
    flexGrow: 1,
    color: '#333',
  },
  heartButton: {
    padding: 0,
  },
  heartIcon: {
    color: '#ccc',
  },
  heartIconLiked: {
    color: '#ff4d4d',
  },
  postImage: {
    borderRadius: '8px',
    objectFit: 'cover',
    height: '150px',
    width: '100%',
  },
  link: {
    textDecoration: 'none',
  },
}

export default Feed
