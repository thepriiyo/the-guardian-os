'use client';

import { useState, useEffect } from 'react';

export interface LocationData {
  city: string;
  region: string;
  country: string;
  lat?: number;
  lon?: number;
  currency?: string;
  detected: boolean;
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationData>({
    city: 'Global',
    region: 'Unknown',
    country: 'World',
    detected: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function detectLocation() {
      try {
        // 1. Try IP-based detection first (faster, no permission needed)
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();

        if (data.status === 'success') {
          setLocation({
            city: data.city,
            region: data.regionName,
            country: data.country,
            lat: data.lat,
            lon: data.lon,
            currency: 'INR', // Defaulting to INR for India if detected there, or we can fetch currency mapping
            detected: true,
          });
          setLoading(false);
          return;
        }

        // 2. Fallback to Browser Geolocation if IP fails or permission is given
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              // We could use reverse geocoding here if needed
              setLocation(prev => ({
                ...prev,
                lat: latitude,
                lon: longitude,
                detected: true,
              }));
              setLoading(false);
            },
            (err) => {
              console.error('Browser Geolocation error:', err);
              setLoading(false);
            }
          );
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Location detection failed:', err);
        setError('Could not detect location');
        setLoading(false);
      }
    }

    detectLocation();
  }, []);

  return { location, loading, error };
}
