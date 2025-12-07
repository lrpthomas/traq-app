/**
 * Native Plugins Service
 * =============================================================================
 * Unified interface for Capacitor plugins. Falls back to web APIs when
 * running in browser, uses native APIs on iOS/Android.
 */

import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

// Re-export types for convenience
export type { Photo, Position };

/**
 * Check if running on native platform (iOS/Android)
 */
export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Get current platform
 */
export function getPlatform(): 'ios' | 'android' | 'web' {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
}

// =============================================================================
// Camera
// =============================================================================

export interface TakePhotoOptions {
  quality?: number; // 0-100
  width?: number;
  height?: number;
  source?: 'camera' | 'photos' | 'prompt';
}

/**
 * Take a photo using camera or select from gallery
 */
export async function takePhoto(options: TakePhotoOptions = {}): Promise<Photo | null> {
  try {
    // Request permissions first
    const permissions = await Camera.checkPermissions();
    if (permissions.camera !== 'granted') {
      const requested = await Camera.requestPermissions({ permissions: ['camera'] });
      if (requested.camera !== 'granted') {
        throw new Error('Camera permission denied');
      }
    }

    const source = options.source === 'camera'
      ? CameraSource.Camera
      : options.source === 'photos'
        ? CameraSource.Photos
        : CameraSource.Prompt;

    const photo = await Camera.getPhoto({
      quality: options.quality ?? 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source,
      width: options.width,
      height: options.height,
      saveToGallery: true,
    });

    return photo;
  } catch (error) {
    if ((error as Error).message?.includes('cancelled') ||
        (error as Error).message?.includes('canceled')) {
      return null; // User cancelled
    }
    console.error('Camera error:', error);
    throw error;
  }
}

/**
 * Get photo as base64 data URL for display
 */
export async function photoToDataUrl(photo: Photo): Promise<string> {
  if (photo.dataUrl) {
    return photo.dataUrl;
  }

  if (photo.webPath) {
    return photo.webPath;
  }

  if (photo.path && isNative()) {
    const result = await Filesystem.readFile({
      path: photo.path,
    });
    return `data:image/${photo.format};base64,${result.data}`;
  }

  throw new Error('Unable to convert photo to data URL');
}

// =============================================================================
// Geolocation
// =============================================================================

export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

/**
 * Get current GPS position
 */
export async function getCurrentPosition(options: LocationOptions = {}): Promise<Position | null> {
  try {
    // Request permissions first
    const permissions = await Geolocation.checkPermissions();
    if (permissions.location !== 'granted') {
      const requested = await Geolocation.requestPermissions({ permissions: ['location'] });
      if (requested.location !== 'granted') {
        throw new Error('Location permission denied');
      }
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: options.enableHighAccuracy ?? true,
      timeout: options.timeout ?? 10000,
      maximumAge: options.maximumAge ?? 0,
    });

    return position;
  } catch (error) {
    console.error('Geolocation error:', error);
    throw error;
  }
}

/**
 * Format position as lat/long string
 */
export function formatPosition(position: Position): string {
  const { latitude, longitude } = position.coords;
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

// =============================================================================
// Filesystem
// =============================================================================

export interface SaveFileOptions {
  fileName: string;
  data: string | Blob;
  directory?: 'documents' | 'data' | 'cache';
}

/**
 * Save file to device storage
 */
export async function saveFile(options: SaveFileOptions): Promise<string> {
  const directory = options.directory === 'documents'
    ? Directory.Documents
    : options.directory === 'cache'
      ? Directory.Cache
      : Directory.Data;

  let data: string;
  if (options.data instanceof Blob) {
    data = await blobToBase64(options.data);
  } else {
    data = options.data;
  }

  const result = await Filesystem.writeFile({
    path: options.fileName,
    data,
    directory,
    encoding: Encoding.UTF8,
  });

  return result.uri;
}

/**
 * Read file from device storage
 */
export async function readFile(
  path: string,
  directory: 'documents' | 'data' | 'cache' = 'data'
): Promise<string> {
  const dir = directory === 'documents'
    ? Directory.Documents
    : directory === 'cache'
      ? Directory.Cache
      : Directory.Data;

  const result = await Filesystem.readFile({
    path,
    directory: dir,
    encoding: Encoding.UTF8,
  });

  return result.data as string;
}

/**
 * Delete file from device storage
 */
export async function deleteFile(
  path: string,
  directory: 'documents' | 'data' | 'cache' = 'data'
): Promise<void> {
  const dir = directory === 'documents'
    ? Directory.Documents
    : directory === 'cache'
      ? Directory.Cache
      : Directory.Data;

  await Filesystem.deleteFile({
    path,
    directory: dir,
  });
}

// =============================================================================
// Preferences (Key-Value Storage)
// =============================================================================

/**
 * Store a value in preferences
 */
export async function setPreference(key: string, value: string): Promise<void> {
  await Preferences.set({ key, value });
}

/**
 * Get a value from preferences
 */
export async function getPreference(key: string): Promise<string | null> {
  const { value } = await Preferences.get({ key });
  return value;
}

/**
 * Remove a value from preferences
 */
export async function removePreference(key: string): Promise<void> {
  await Preferences.remove({ key });
}

// =============================================================================
// Status Bar & Splash Screen
// =============================================================================

/**
 * Hide the splash screen
 */
export async function hideSplashScreen(): Promise<void> {
  if (isNative()) {
    await SplashScreen.hide();
  }
}

/**
 * Set status bar style
 */
export async function setStatusBarStyle(style: 'light' | 'dark'): Promise<void> {
  if (isNative()) {
    await StatusBar.setStyle({
      style: style === 'light' ? Style.Light : Style.Dark,
    });
  }
}

/**
 * Set status bar background color (Android only)
 */
export async function setStatusBarColor(color: string): Promise<void> {
  if (isNative() && getPlatform() === 'android') {
    await StatusBar.setBackgroundColor({ color });
  }
}

// =============================================================================
// Helpers
// =============================================================================

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix for Capacitor
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
