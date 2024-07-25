import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid ID");
  }

  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [{ userId: currentUser.id }, { listing: { userId: currentUser.id } }],
    },
  });

  return NextResponse.json(reservation);
}

interface IParams {
  listingId?: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({
      status: 403,
      body: "Forbidden: You do not have permission to access this resource.",
    });
  }

  const { reservationId: listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid Listing ID");
  }

  // Check if the user has reserved a seat in the specified listing
  const userReservedListing = await prisma.reservation.findFirst({
    where: {
      userId: currentUser.id,
      listingId: listingId,
    },
  });
  if (userReservedListing) {
    // User has reserved a seat in the listing
    return NextResponse.json({
      message: "successfully.",
    });
  } else {
    // User has not reserved a seat in the listing
    return NextResponse.json(
      {
        message: "User has not reserved a seat in the listing.",
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId: listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid Listing ID");
  }

  const { otp } = await request.json();

  if (!otp) {
    return NextResponse.json(
      {
        message: "OTP is required in the request body.",
      },
      { status: 400 }
    );
  }

  const userReservedListing = await prisma.reservation.findFirst({
    where: {
      userId: currentUser.id,
      listingId: listingId,
    },
  });

  if (!userReservedListing) {
    return NextResponse.json(
      {
        message: "User has not reserved a seat in the listing.",
      },
      { status: 400 }
    );
  }

  if (userReservedListing.otp && userReservedListing.otp != otp) {
    return NextResponse.json(
      {
        message: "Invalid OTP.",
      },
      { status: 400 }
    );
  }

  const updatedReservation = await prisma.reservation.update({
    where: { id: userReservedListing.id },
    data: { otp: null },
  });

  return NextResponse.json({
    message: "Reservation successfully confirmed.",
    reservation: updatedReservation,
  });
}

export async function PUT(request: Request, { params }: { params: IParams }) {
  try {
    const body = await request.json();
    const { reservationId } = params;
    const { newTime, rescheduleCount } = body;

    const newReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        startDate: newTime,
        startTime: newTime,
        rescheduleCount: rescheduleCount,
      },
    });
    //console.log(newReservation);
    return NextResponse.json(newReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "Error updating reservation" },
      { status: 500 }
    );
  }
}
