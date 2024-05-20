import prisma from "@/app/libs/prismadb";

export async function getPaymentHistoryById(listingId: string) {
  try {
    console.log("id is ",listingId)
    const res = await prisma?.paymentHistory.findMany({
      where: { listingId: listingId },
    });

    if (res) {
      return res;
    } else {
      console.log("No payment history found for listingId: ", listingId);
      return [];
    }
  } catch (error:any) {
    //console.error("Error fetching payment history:", error);
    throw new Error("Error fetching payment history");
  }
}
