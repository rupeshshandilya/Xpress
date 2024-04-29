import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { IParams } from "@/app/actions/approveListing";

export async function GET(request: Request, { params }: { params: IParams }) {
  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  const booked = await prisma.paymentHistory.findFirst({
    where: { listingId: listingId },
  });

  if (!booked) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  } else {
    return NextResponse.json({ message: "successfully deleted" });
  }
}