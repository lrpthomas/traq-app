/**
 * useNative Hook
 * =============================================================================
 * React hook for accessing native device features via Capacitor.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  isNative,
  getPlatform,
  takePhoto,
  photoToDataUrl,
  getCurrentPosition,
  formatPosition,
  hideSplashScreen,
  setStatusBarStyle,
  setStatusBarColor,
  type Photo,
  type Position,
  type TakePhotoOptions,
  type LocationOptions,
} from '@/lib/native/plugins';

export interface UseNativeResult {
  isNative: boolean;
  platform: 'ios' | 'android' | 'web';

  // Camera
  takePhoto: (options?: TakePhotoOptions) => Promise<{ photo: Photo; dataUrl: string } | null>;
  isCapturingPhoto: boolean;
  photoError: string | null;

  // Location
  getLocation: (options?: LocationOptions) => Promise<Position | null>;
  isGettingLocation: boolean;
  locationError: string | null;
  currentPosition: Position | null;
  formattedPosition: string | null;
}

export function useNative(): UseNativeResult {
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);

  // Initialize native features on mount
  useEffect(() => {
    const init = async () => {
      if (isNative()) {
        // Hide splash screen after app is ready
        await hideSplashScreen();

        // Set status bar style
        await setStatusBarStyle('dark');
        if (getPlatform() === 'android') {
          await setStatusBarColor('#16a34a'); // green-600
        }
      }
    };

    init();
  }, []);

  const handleTakePhoto = useCallback(async (options?: TakePhotoOptions) => {
    setIsCapturingPhoto(true);
    setPhotoError(null);

    try {
      const photo = await takePhoto(options);
      if (!photo) {
        return null; // User cancelled
      }

      const dataUrl = await photoToDataUrl(photo);
      return { photo, dataUrl };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to take photo';
      setPhotoError(message);
      return null;
    } finally {
      setIsCapturingPhoto(false);
    }
  }, []);

  const getLocation = useCallback(async (options?: LocationOptions) => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const position = await getCurrentPosition(options);
      setCurrentPosition(position);
      return position;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get location';
      setLocationError(message);
      return null;
    } finally {
      setIsGettingLocation(false);
    }
  }, []);

  return {
    isNative: isNative(),
    platform: getPlatform(),

    // Camera
    takePhoto: handleTakePhoto,
    isCapturingPhoto,
    photoError,

    // Location
    getLocation,
    isGettingLocation,
    locationError,
    currentPosition,
    formattedPosition: currentPosition ? formatPosition(currentPosition) : null,
  };
}

export default useNative;
