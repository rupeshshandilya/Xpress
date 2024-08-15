"use client";
import React, { useCallback, useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import {toast} from "react-hot-toast";
interface GoogleMapsProps {
  onSelect: (lat: number, long: number) => void;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({ onSelect }) => {
  const [userLat, setUserLat] = useState<number>(0);
  const [userLong, setUserLong] = useState<number>(0);
  const [marker, setMarker] = useState<google.maps.LatLng | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onClick = (event: google.maps.MapMouseEvent) => {
    const latLng = event.latLng!;
    setMarker(latLng);
    setUserLat(latLng.lat());
    setUserLong(latLng.lng());
  };

  const handleConfirmLocation = () => {
    if (marker) {
      onSelect(marker.lat(), marker.lng());
    }
    toast.success("Location Confirmed on map successfully")
  };

  const getUserLocation = useCallback(() => {
    if (!isLoaded) return;

    const onSuccess = (location: GeolocationPosition) => {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      setUserLat(latitude);
      setUserLong(longitude);

      // Ensure the google object is available before using it
      const newMarker = new google.maps.LatLng(latitude, longitude);
      setMarker(newMarker);
    };

    const onError = (err: any) => {
      console.log("Error retrieving location:", err);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [isLoaded]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ position: "relative" }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={{ lat: userLat, lng: userLong }}
        zoom={15}
        onLoad={onLoad}
        onClick={onClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>

      <button
        onClick={handleConfirmLocation}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Confirm Location
      </button>
    </div>
  );
};

export default GoogleMaps;
