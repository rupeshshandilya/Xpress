"use client";
import React, { useState, useEffect, useCallback } from "react";
import { SafeUser, SafeListing } from "@/app/types";
import ListingCard from "./components/listings/ListingCard";
import Container from "./components/Container";
import axios from "axios";

interface HomePageProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const HomePage: React.FC<HomePageProps> = ({ listings, currentUser }) => {
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLong, setUserLong] = useState<number | null>(null);
  const [distances, setDistances] = useState<Map<number, number>>(new Map());

  const getUserLocation = useCallback(() => {
    function onSuccess(location: GeolocationPosition) {
      setUserLat(location.coords.latitude);
      setUserLong(location.coords.longitude);
    }
    function onError(error: GeolocationPositionError) {
      console.log("Geolocation error", error.message);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortedListings =
    userLat && userLong
      ? listings.slice().sort((a, b) => {
          const distanceA = haversineDistance(
            userLat,
            userLong,
            a.coordinates.latitude,
            a.coordinates.longitude
          );
          const distanceB = haversineDistance(
            userLat,
            userLong,
            b.coordinates.latitude,
            b.coordinates.longitude
          );
          return distanceA - distanceB;
        })
      : listings;

  return (
    <Container>
      <div className="pt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4 2xl:grid-cols-6 gap-8">
        {sortedListings.map((listing) => {
          const distance =
            userLat && userLong
              ? haversineDistance(
                  userLat,
                  userLong,
                  listing.coordinates.latitude,
                  listing.coordinates.longitude
                ).toFixed(0)
              : null;
          return (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={listing}
              address={listing.address}
              distance={distance}
            />
          );
        })}
      </div>
    </Container>
  );
};

export default HomePage;
