import prisma from "@/app/libs/prismadb";

export async function getPaymentHistory() {
  try {
    const res = await prisma.paymentHistory.groupBy({
      by: ['listingId', 'title'], // Include both listingId and title
      _sum: {
        amount: true,
        dueAmount:true,
      },
    });
  
    if (res) {
      // Restructure the response to match the desired format
      const formattedResponse = res.map((item: any) => ({
        amount: item._sum.amount,
        dueAmount:(item._sum.dueAmount*0.93).toFixed(2), // 7%
        listingId: item.listingId,
        title: item.title,
      }));
      return formattedResponse;
    } else {
      console.log("Something went wrong");
    }
  } 
    catch (error: any) {
      // console.log(error.response?.data);
      
    throw new Error(error);
  }
}
