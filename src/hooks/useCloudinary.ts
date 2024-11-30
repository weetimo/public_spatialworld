import { useState } from 'react'
import axios from 'axios'

const useCloudinary = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'preset')
    formData.append('cloud_name', 'dgfvymgcc')

    try {
      setUploading(true);
      setError(null);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dgfvymgcc/image/upload`,
        formData
      );
      setUploading(false);
      return response.data.secure_url
    } catch (err) {
      setUploading(false);
      setError('Failed to upload image');
      console.error('Error uploading image to Cloudinary:', err);
      return null;
    }
  };

  return { uploadImage, uploading, error };
};

export default useCloudinary