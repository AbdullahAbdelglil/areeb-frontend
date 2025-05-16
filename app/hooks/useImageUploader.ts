import { useState } from 'react';
import { api } from '@/services/api';
import { getAdminEventDetails } from '@/services/adminApi';

export function useImageUploader() {
  const [uploading, setUploading] = useState(false);

  const handleUploadImage = async (
    eventId: string | string[] | any,
    setImageUrl: (url: string) => void
  ) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      await api.post(`/admin/events/${eventId}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updated = await getAdminEventDetails(eventId);
      setImageUrl(updated.imageUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return { handleUploadImage, uploading };
}
