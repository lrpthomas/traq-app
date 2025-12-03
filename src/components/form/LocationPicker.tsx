'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Info, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { GpsLocation } from '@/types/traq';

interface LocationPickerProps {
  location: GpsLocation | null;
  onLocationChange: (location: GpsLocation | null) => void;
  onCopyToAddress: (address: string) => void;
}

export function LocationPicker({
  location,
  onLocationChange,
  onCopyToAddress,
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyToFormEnabled, setCopyToFormEnabled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Store handleLocationUpdate in a ref for use in map event handlers
  const handleLocationUpdateRef = useRef<((lat: number, lng: number) => Promise<void>) | null>(null);

  // Store initial location for map initialization
  const initialLocationRef = useRef(location);

  // Initialize Leaflet map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet (client-side only)
    import('leaflet').then((L) => {
      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Fix default marker icon issue in Leaflet with bundlers
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Default to center of USA if no location
      const initLoc = initialLocationRef.current;
      const defaultLat = initLoc?.latitude ?? 39.8283;
      const defaultLng = initLoc?.longitude ?? -98.5795;
      const defaultZoom = initLoc ? 16 : 4;

      const map = L.map(mapRef.current!, {
        center: [defaultLat, defaultLng],
        zoom: defaultZoom,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Add existing marker if location exists
      if (initLoc) {
        const marker = L.marker([initLoc.latitude, initLoc.longitude], {
          draggable: true,
        }).addTo(map);

        marker.on('dragend', async () => {
          const pos = marker.getLatLng();
          if (handleLocationUpdateRef.current) {
            await handleLocationUpdateRef.current(pos.lat, pos.lng);
          }
        });

        markerRef.current = marker;
      }

      // Click on map to set location
      map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const marker = L.marker([lat, lng], {
            draggable: true,
          }).addTo(map);

          marker.on('dragend', async () => {
            const pos = marker.getLatLng();
            if (handleLocationUpdateRef.current) {
              await handleLocationUpdateRef.current(pos.lat, pos.lng);
            }
          });

          markerRef.current = marker;
        }

        if (handleLocationUpdateRef.current) {
          await handleLocationUpdateRef.current(lat, lng);
        }
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Reverse geocode to get address
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'TRAQ-App/1.0',
          },
        }
      );

      if (!response.ok) throw new Error('Geocoding failed');

      const data = await response.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // Store callbacks in refs to avoid dependency issues
  const onLocationChangeRef = useRef(onLocationChange);
  const onCopyToAddressRef = useRef(onCopyToAddress);
  const copyToFormEnabledRef = useRef(copyToFormEnabled);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
    onCopyToAddressRef.current = onCopyToAddress;
    copyToFormEnabledRef.current = copyToFormEnabled;
  }, [onLocationChange, onCopyToAddress, copyToFormEnabled]);

  // Handle location update (from click or drag)
  const handleLocationUpdate = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    setError(null);

    try {
      const address = await reverseGeocode(lat, lng);

      const newLocation: GpsLocation = {
        latitude: lat,
        longitude: lng,
        address,
        timestamp: new Date(),
      };

      onLocationChangeRef.current(newLocation);

      // Auto-copy to form if enabled
      if (copyToFormEnabledRef.current) {
        onCopyToAddressRef.current(address);
      }
    } catch {
      setError('Failed to get address');
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  // Keep the ref updated with latest handleLocationUpdate
  useEffect(() => {
    handleLocationUpdateRef.current = handleLocationUpdate;
  }, [handleLocationUpdate]);

  // Get current location using browser geolocation
  const handleFindMyLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Update map view and marker
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 17);

          import('leaflet').then((L) => {
            if (markerRef.current) {
              markerRef.current.setLatLng([latitude, longitude]);
            } else if (mapInstanceRef.current) {
              const marker = L.marker([latitude, longitude], {
                draggable: true,
              }).addTo(mapInstanceRef.current);

              marker.on('dragend', async () => {
                const pos = marker.getLatLng();
                if (handleLocationUpdateRef.current) {
                  await handleLocationUpdateRef.current(pos.lat, pos.lng);
                }
              });

              markerRef.current = marker;
            }
          });
        }

        // Get address via reverse geocoding
        setIsGeocoding(true);
        const address = await reverseGeocode(latitude, longitude);

        const newLocation: GpsLocation = {
          latitude,
          longitude,
          address,
          accuracy,
          timestamp: new Date(),
        };

        onLocationChangeRef.current(newLocation);

        if (copyToFormEnabledRef.current) {
          onCopyToAddressRef.current(address);
        }

        setIsLocating(false);
        setIsGeocoding(false);
      },
      (err) => {
        setIsLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable. Please try again.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('Failed to get location. Please try again.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Handle copy to form address toggle
  const handleCopyToggle = useCallback((enabled: boolean) => {
    setCopyToFormEnabled(enabled);
    if (enabled && location?.address) {
      onCopyToAddressRef.current(location.address);
    }
  }, [location?.address]);

  // Manual copy button
  const handleManualCopy = useCallback(() => {
    if (location?.address) {
      onCopyToAddressRef.current(location.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [location?.address]);

  return (
    <div className="rounded-lg bg-slate-100 border border-slate-300 p-4 space-y-4">
      {/* Header with info tooltip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-slate-600" />
          <h3 className="font-medium text-slate-800">GPS Location</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs bg-slate-800 text-white p-2">
              <p className="text-sm">
                GPS coordinates are for the report only and will not appear on the official TRAQ PDF form.
                Use the toggle below to copy this location to the form address field.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFindMyLocation}
          disabled={isLocating}
          className="bg-white hover:bg-slate-50"
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4 mr-2" />
          )}
          {isLocating ? 'Locating...' : 'Find My Location'}
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* Map */}
      <div
        ref={mapRef}
        className="h-48 rounded-md border border-slate-300 bg-white z-0"
        style={{ minHeight: '192px' }}
      />
      {!mapLoaded && (
        <div className="h-48 rounded-md border border-slate-300 bg-slate-50 flex items-center justify-center -mt-52 relative z-10">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      )}

      {/* Location details */}
      {location && (
        <div className="space-y-3">
          {/* Address */}
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Address</Label>
            <div className="flex gap-2">
              <Input
                value={location.address}
                readOnly
                className="bg-white text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleManualCopy}
                className="shrink-0"
                title="Copy to form address"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Latitude</Label>
              <Input
                value={location.latitude.toFixed(6)}
                readOnly
                className="bg-white text-sm font-mono"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Longitude</Label>
              <Input
                value={location.longitude.toFixed(6)}
                readOnly
                className="bg-white text-sm font-mono"
              />
            </div>
          </div>

          {/* Accuracy if available */}
          {location.accuracy && (
            <p className="text-xs text-slate-500">
              Accuracy: ±{Math.round(location.accuracy)} meters
            </p>
          )}

          {/* Toggle for auto-copy to form */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Label htmlFor="copy-toggle" className="text-sm text-slate-700 cursor-pointer">
                Auto-copy to form address
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-slate-500 hover:text-slate-700">
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-white p-2">
                  <p className="text-xs">
                    When enabled, the GPS address will automatically update the form&apos;s Address/Tree Location field.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              id="copy-toggle"
              checked={copyToFormEnabled}
              onCheckedChange={handleCopyToggle}
            />
          </div>
        </div>
      )}

      {/* Loading state for geocoding */}
      {isGeocoding && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Getting address...</span>
        </div>
      )}

      {/* Instructions when no location */}
      {!location && !isLocating && (
        <p className="text-sm text-slate-500 text-center py-2">
          Click &quot;Find My Location&quot; or tap the map to set the tree location.
        </p>
      )}
    </div>
  );
}
