import ClientOnly from '@/app/ClientOnly';
import EmptyState from '@/app/components/EmptyState';
import { getPaymentHistoryById } from '../../../actions/getPaymentHistoryById';
import PaymentHistoryClient from './PaymentHistoryClient';

interface Iparams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: Iparams }) => {
  const history = await getPaymentHistoryById(params.listingId || ' ');
  
  console.log("TR is ",history)
  if (!history) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }
  return (
    <PaymentHistoryClient history={history} />
  );
};

export default ListingPage;
