// app/(group)/page.tsx
import { getPaymentHistory } from "@/app/actions/getpaymenthistory";
import EmptyState from "@/app/components/EmptyState";
import PaymentHistory from "./paymentHistory";

const PaymentHistoryPage = async () => {
  const history = await getPaymentHistory();
  //console.log("His is ",history)
  if (!history || history.length === 0) {
    return (
      <div>
        <EmptyState title="No payment history to show" />
      </div>
    );
  }

  return <PaymentHistory history={history} />;
};

export default PaymentHistoryPage;




/* import { getPaymentHistory } from "@/app/actions/getpaymenthistory";
import EmptyState from "@/app/components/EmptyState";
import React, { useEffect } from "react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
const PaymentHistory = async () => {
  const history = await getPaymentHistory();
  if (!history)
    return (
      <div>
        <EmptyState title="No payment history to show" />
      </div>
    );
  console.log(history);

  return (
    <div className="py-8 px-4 relative">
    <h1 className="text-xl font-semibold text-gray-900 mb-4">History</h1>
    <p className="text-sm text-gray-700 mb-6">A payment history of all the businesses.</p>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left font-semibold text-gray-900 py-2 px-3">S.no</th>
            <th className="text-left font-semibold text-gray-900 py-2 px-3">Amount</th>
            <th className="text-left font-semibold text-gray-900 py-2 px-3">Title</th>
            <th className="text-left font-semibold text-gray-900 py-2 px-3">Created AT</th>
            <th className="sr-only">Edit</th>
          </tr>
        </thead>

        <tbody>
          {history.map((item, index) => (
            <tr key={item.id} className="border-b last:border-b-0">
              <td className="py-4 px-3 text-sm text-gray-900">{index + 1}</td>
              <td className="py-4 px-3 text-sm text-gray-500">{item.amount}</td>
              <td className="py-4 px-3 text-sm text-gray-500">{item.title}</td>
              <td className="py-4 px-3 text-sm text-gray-500">
                {new Date(item.createdAt).toLocaleString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default PaymentHistory; */
