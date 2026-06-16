import { useState, useEffect, useCallback } from 'react';

export const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    error: null
  });

  const requestLocation = useCallback(() => {
    const onSuccess = (position) => {
      setLocation({
        loaded: true,
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        error: null
      });
    };

    const onError = (error) => {
      setLocation({
        loaded: true,
        coordinates: { lat: "", lng: "" },
        error: {
          code: error.code,
          message: error.message
        }
      });
    };

    if (!navigator.geolocation) {
      setLocation((state) => ({
        ...state,
        loaded: true,
        error: {
          code: 0,
          message: "Geolocation not supported by your browser"
        }
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      requestLocation();
    }, 0);
    return () => clearTimeout(timer);
  }, [requestLocation]);

  return { ...location, refetch: requestLocation };
};

export default useGeoLocation;
