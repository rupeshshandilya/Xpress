import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
function generateOTP() {
  const OTP_LENGTH = 6;
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH) - 1;

  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  return otp;
}
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }
  const body = await request.json();
  const { listingId, startDate, startTime, totalPrice, features } = body;

  if (!listingId || !startDate || !startTime || !totalPrice) {
    console.log(listingId, startDate, startTime, totalPrice);
    return NextResponse.error();
  }
  const otp = generateOTP();
  const selectedTimeNew = startDate.slice(0, features.length);
  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate: selectedTimeNew,
          startTime: selectedTimeNew,
          totalPrice,
          features,
          otp,
        },
      },
    },
  });

  return NextResponse.json(listingAndReservation);
}
