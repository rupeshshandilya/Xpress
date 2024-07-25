import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface Props {
  listingId: string;
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const body: unknown = await request.json();
  const { listingId } = body as Props;

  if (!currentUser) {
    return NextResponse.error();
  }

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid listingId");
  }

  const payment = await prisma.paymentHistory.updateMany({
    where: { listingId: listingId },
    data: { dueAmount: 0 },
  });

  if (!payment) {
    return NextResponse.error();
  }

  return NextResponse.json({
    status: 200,
    message: "Due amount set to 0 for listingId: " + listingId,
  });
}
