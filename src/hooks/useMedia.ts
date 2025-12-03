'use client';

import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import type { MediaAttachment } from '@/types/traq';

/**
 * Hook for managing media attachments for an assessment
 */
export function useMedia(assessmentId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live query for media attachments
  const media = useLiveQuery(
    () => db.media.where('assessmentId').equals(assessmentId).toArray(),
    [assessmentId]
  );

  /**
   * Add a new media attachment from a File
   */
  const addMedia = useCallback(
    async (file: File, caption = '') => {
      setIsUploading(true);
      setError(null);

      try {
        // Determine media type
        let type: MediaAttachment['type'] = 'document';
        if (file.type.startsWith('image/')) {
          type = 'photo';
        } else if (file.type.startsWith('video/')) {
          type = 'video';
        }

        // Get location if available
        let location: MediaAttachment['location'] = undefined;
        if ('geolocation' in navigator) {
          try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
                enableHighAccuracy: false,
              });
            });
            location = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            };
          } catch {
            // Location not available, continue without it
          }
        }

        const attachment: MediaAttachment = {
          id: uuidv4(),
          assessmentId,
          type,
          filename: file.name,
          mimeType: file.type,
          blob: file,
          caption,
          createdAt: new Date(),
          location,
        };

        await db.media.add(attachment);
        return attachment;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add media';
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [assessmentId]
  );

  /**
   * Add media from camera capture
   */
  const capturePhoto = useCallback(async (): Promise<MediaAttachment | null> => {
    // Create a file input for camera capture
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use back camera

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const attachment = await addMedia(file);
            resolve(attachment);
          } catch {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };

      input.click();
    });
  }, [addMedia]);

  /**
   * Add media from file picker
   */
  const pickFile = useCallback(async (): Promise<MediaAttachment | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,video/*,.pdf,.doc,.docx';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const attachment = await addMedia(file);
            resolve(attachment);
          } catch {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };

      input.click();
    });
  }, [addMedia]);

  /**
   * Update media caption
   */
  const updateCaption = useCallback(async (mediaId: string, caption: string) => {
    await db.media.update(mediaId, { caption });
  }, []);

  /**
   * Delete a media attachment
   */
  const deleteMedia = useCallback(async (mediaId: string) => {
    await db.media.delete(mediaId);
  }, []);

  /**
   * Get blob URL for displaying media
   */
  const getMediaUrl = useCallback((attachment: MediaAttachment): string => {
    return URL.createObjectURL(attachment.blob);
  }, []);

  return {
    media: media || [],
    isLoading: media === undefined,
    isUploading,
    error,
    addMedia,
    capturePhoto,
    pickFile,
    updateCaption,
    deleteMedia,
    getMediaUrl,
  };
}
