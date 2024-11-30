import { useState } from 'react'

const useImageOperations = (initImages: string[]) => {
  const [images, setImages] = useState<string[]>(initImages)

  const addImage = (newImage: string): void => {
    setImages((prevImages) => [...prevImages, newImage])
  }

  return { images, addImage }
}

export default useImageOperations