
import prisma from "@/app/libs/prismadb";

export interface IParams {
  reservationId?: string;
}

export async function approveReservation(params: IParams) {
  try {
    const { reservationId } = params;
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { user: true },
    });

    // Check if reservation exists
    if (!reservation) {
      throw new Error("Reservation not found");
    }
    // Update the listing in the database
    const updatedListingInDB = await prisma.listing.update({
      where: { id: reservationId },
      data: { approved: true },
      include: { user: true },
    });

    return updatedListingInDB;
  } catch (error:any) {
    throw new Error(error);
  }
}
