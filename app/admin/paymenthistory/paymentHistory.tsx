// app/components/PaymentHistoryClient.tsx
"use client"
import React,{useState} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@mui/material";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const PaymentHistory = ({ history }: { history: any[] }) => {

  const router=useRouter()

  const handleClearDueAmount = async (listingId: string) => {
    try {
      const response = await fetch('https://book.thexpresssalon.com/api/cleardueamount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      });
      
      if (response.ok) {
        // Reload the payment history after clearing due amount
        toast.success("Due Payment Cleared");
        router.refresh();
      } else {
        toast.error('Failed to clear due amount');
        console.error('Failed to clear due amount');
      }
    } catch (error) {
      console.error('Error clearing due amount:', error);
    }
  };

  return (
    <div className="py-8 px-4 relative">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">History</h1>
      <p className="text-sm text-gray-700 mb-6">
        A payment history of all the businesses.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left font-semibold text-gray-900 py-2 px-3">S.no</th>
              <th className="text-left font-semibold text-gray-900 py-2 px-3">Title</th>
              <th className="text-left font-semibold text-gray-900 py-2 px-3">Amount</th>
              <th className="text-left font-semibold text-gray-900 py-2 px-3">Due Amount</th>
              <th className="text-left font-semibold text-gray-900 py-2 px-3">Clear Due Amount</th>
              {/* <th className="text-left font-semibold text-gray-900 py-2 px-3">Created AT</th> */}
              {/* <th className="sr-only">Edit</th> */}
            </tr>
          </thead>

          <tbody>
  {history.map((item, index) => (
    <tr
      key={item.id}
      className="border-b last:border-b-0"
      onClick={() => router.push(`/admin/paymenthistory/${item.listingId}`)}
    >
      <td className="py-4 px-3 text-sm text-gray-900">{index + 1}</td>
      <td className="py-4 px-3 text-sm text-gray-500">{item.title}</td>
      <td className="py-4 px-3 text-sm text-gray-500">{item.amount}</td>
      <td className="py-4 px-3 text-sm text-gray-500">{item.dueAmount}</td>
      <td className="py-4 px-3 text-sm text-gray-500">
        <Button
          sx={{
            backgroundColor: "red",
            color: "white",
            "&:hover": {
              backgroundColor: "red",
              color: "white",
              cursor: "pointer",
            },
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevents the row click event
            handleClearDueAmount(item.listingId);
            router.refresh()
          }}
        >
          Clear
        </Button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
      <hr/>
    </div>
  );
};

export default PaymentHistory
