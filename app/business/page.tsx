import EmptyState from '@/app/components/EmptyState';
import ClientOnly from '../ClientOnly';

import getCurrentUser from '@/app/actions/getCurrentUser';
import BusinessClient from './BusinessClient';
import getListings from '../actions/getListings';
import { getPaymentHistorySum } from '../actions/getPaymentHistorySum';
import { getDuePaymentSum } from '../actions/getDuePaymentSum';

const Business = async () => {
  const currentUser = await getCurrentUser();
   
  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
      </ClientOnly>
    );
  }

  const listings = await getListings({ userId: currentUser.id });
    
  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState title="No Business" subtitle="Have no services" />
      </ClientOnly>
    );
  }

  const revenueMap: { [key: string]: number } = {};
  const dueAmountMap: { [key: string]: number } = {};

  await Promise.all(listings.map(async (listing: any) => {
    const totalRevenue = await getPaymentHistorySum(listing.id);
    revenueMap[listing.id]=totalRevenue ? Number(totalRevenue):0;
  }));

  await Promise.all(listings.map(async (listing: any) => {
    const totalRevenue = await getDuePaymentSum(listing.id);
    dueAmountMap[listing.id]=totalRevenue ? Number(totalRevenue):0;
  }));
  
  console.log("rev ",revenueMap) 

  
  return (
    <ClientOnly>
      <BusinessClient listings={listings} currentUser={currentUser} revenueMap={revenueMap} dueAmountMap={dueAmountMap}/>
    </ClientOnly>
  );
};

export default Business;
