import prisma from "@/app/libs/prismadb";

export async function getPaymentHistory() {
  try {
    const res = await prisma.paymentHistory.groupBy({
      by: ['listingId', 'title'], // Include both listingId and title
      _sum: {
        amount: true,
      },
    });
  
    if (res) {
      // Restructure the response to match the desired format
      const formattedResponse = res.map((item: any) => ({
        amount: item._sum.amount,
        listingId: item.listingId,
        title: item.title,
      }));
  
      return formattedResponse;
    } else {
      console.log("Something went wrong");
    }
  } 
    catch (error: any) {
    throw new Error(error);
  }
}
