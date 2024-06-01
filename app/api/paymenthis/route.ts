import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { IParams } from "@/app/actions/approveReservation";

interface Props{
    reservationId:string
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const body: unknown = await request.json();
    const { reservationId } = body as Props;

    if (!reservationId || typeof reservationId !== "string") {
      throw new Error("Invalid ID");
    }
    console.log("Revvv ",reservationId);
    const paymentHistory = await prisma.paymentHistory.findFirst({
      where: { reservationId:reservationId },
    });

    if (!paymentHistory) {
      return NextResponse.json({ message: "Reservation not found" }, { status: 404 });
    }

    // Return the found payment history
    return NextResponse.json(paymentHistory);    
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}