// src/context/LocationContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [address, setAddress] = useState(null); // ← NEW

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(coords);

        // Reverse geocode
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
          );
          const data = await res.json();
          setAddress({
            city:
              data.address.city || data.address.town || data.address.village,
            state: data.address.state,
            pin: data.address.postcode,
          });
          //   console.log("Address fetched:", data.address);
          //   console.log("Parsed city & pin:", {
          //     city:
          //       data.address.city || data.address.town || data.address.village,
          //     pin: data.address.postcode,
          //   });
        } catch (err) {
          console.error("Failed to fetch address", err);
        }
      },
      (err) => {
        setLocationError("Permission denied or location unavailable.");
        console.error(err);
      }
    );
  }, []);

  return (
    <LocationContext.Provider value={{ location, locationError, address }}>
      {children}
    </LocationContext.Provider>
  );
};
