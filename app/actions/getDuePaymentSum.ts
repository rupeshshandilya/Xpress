import prisma from "@/app/libs/prismadb";

export async function getDuePaymentSum(listingId: string) {
  try {
    const res = await prisma?.paymentHistory.aggregate({
      where: {
        listingId: listingId,
      },
      _sum: {
        dueAmount: true,
      },
    });

    if (res && res._sum && res._sum.dueAmount) {
      const totalRevenue = res._sum.dueAmount;
      const adjustedAmount = (totalRevenue * 0.93).toFixed(2); // Deduct 7% from the total revenue
      return adjustedAmount;
    } else {
      console.log("No payment history found for the listingId: ", listingId);
      return 0; // Return 0 if no payment history found
    }
  } catch (error:any) {
    throw new Error(error);
  }
}
