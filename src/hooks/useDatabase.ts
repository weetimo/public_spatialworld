import { ref, set, get, update, remove } from 'firebase/database'
import { database } from '../config/firebase'

const useDatabase = () => {
  const createData = async (path: string, data: unknown) => {
    try {
      await set(ref(database, path), data)
      console.log(`Data created successfully at path: ${path}`)
    } catch (error) {
      console.error(`Error creating data at path ${path}:`, error)
    }
  }

  const readData = async (path: string) => {
    try {
      const snapshot = await get(ref(database, path))
      if (snapshot.exists()) {
        console.log('Data fetched successfully:', snapshot.val())
        return snapshot.val()
      } else {
        console.log(`No data available at path: ${path}`)
        return null
      }
    } catch (error) {
      console.error(`Error reading data at path ${path}:`, error)
    }
  }

  const updateData = async (path: string, updatedData: any) => {
    try {
      await update(ref(database, path), updatedData)
      console.log(`Data updated successfully at path: ${path}`)
    } catch (error) {
      console.error(`Error updating data at path ${path}:`, error)
    }
  }

  const deleteData = async (path: string) => {
    try {
      await remove(ref(database, path))
      console.log(`Data deleted successfully at path: ${path}`)
    } catch (error) {
      console.error(`Error deleting data at path ${path}:`, error)
    }
  }

  return { createData, readData, updateData, deleteData }
}

export default useDatabase
