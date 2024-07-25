import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          message: "Forbidden: You do not have permission to access this resource.",
        },
        { status: 403 }
      );
    }

    const { listingId } = params;
    console.log(params,listingId)
    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json(
        {
          message: "Invalid Listing ID",
        },
        { status: 400 }
      );
    }

    // Fetch reservations for the specified listing
    const listingReservations = await prisma.reservation.findMany({
      where: {
        listingId: listingId,
      },
    });
    console.log(listingReservations)
    return NextResponse.json(
      listingReservations,
    );
  } catch (error:any) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching reservations.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
