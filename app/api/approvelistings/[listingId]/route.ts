import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { IParams } from "@/app/actions/approveListing";
import { sendMail } from "@/app/helpers/mailer";

export async function PATCH(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }
  const toggleListing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  const approvedListing = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      approved: !toggleListing!.approved,
    },
  });

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      }
    }
  })

  if (!listing || !listing.user || !listing.user.email) {
    throw new Error("User or user email not found");
  }


    await prisma.user.update({
      where: {
        id: listing?.userId,
      },
      data: {
        isSalonOwner: approvedListing.approved,
      }
    })

  const updatedListing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  const emailType = approvedListing.approved ? "APPROVED" : "UNAPPROVE";
  await sendMail({ email: listing?.user.email, userId: listing?.userId, emailType });

  return NextResponse.json(updatedListing);
}
