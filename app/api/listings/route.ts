import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

function createGoogleMapsLink(address: string) {
  const baseUrl = "https://www.google.com/maps/search/?api=1&query=";
  const encodedAddress = encodeURIComponent(address);
  return baseUrl + encodedAddress;
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  
  const {
    title,
    description,
    imageSrc,
    category,
    time,
    features,
    price,
    address,
    offTime,
    offDays,
    coordinates,
    SalonType,
  } = body;
  console.log("SalonType:", body.SalonType);

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const googleMapsLink = createGoogleMapsLink(address);

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      time,
      address,
      features,
      price: parseInt(price, 10),
      userId: currentUser.id,
      offTime,
      offDays,
      coordinates,
      SalonType
    },
  });
  console.log("Created listing:", listing);
  return NextResponse.json(listing);
}
