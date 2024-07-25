"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays } from "date-fns";
import { SafeReservation, SafeUser } from "@/app/types";
import getReservations from "@/app/actions/getReservations";
import format from "date-fns/format";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import RescheduleModal from "../components/listings/RescheduleModal";
import getUserById from "../actions/getUserbyId"
import { sendMail } from "../helpers/mailer";

interface UpcomingClientProps {
  reservations: SafeReservation[];
  currentUser: SafeUser;
}

const UpcomingClient: React.FC<UpcomingClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();

  const [deletingId, setDeletingId] = useState("");
  const [rescheduleId, setRescheduleId] = useState("");
  const [index, setIndex] = useState<string | null>(null);
  const [reservationDetails, setReservationDetails] =
    useState<SafeReservation | null>(null);
  const [reserved, setReserved] = useState<any>([]);

  const onCancel = useCallback(
    async (id: string) => {
      setDeletingId(id);

      await axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("Booking cancelled");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  const onReschedule = useCallback(
    async (reservation: SafeReservation) => {
      try {
        const rescheduleCount = reservation.rescheduleCount ?? 0;
        if (rescheduleCount >= 25) {
          toast.error(
            "Max reschedule Limit for this reservation has been reached"
          );
          return;
        }
        const reservedDetails = await axios.get(
          `/api/reservations/listing/${reservation.listing.id}`
        );
        //console.log("Res d", reservedDetails.data);
        setReserved(reservedDetails.data);
        setReservationDetails(reservation);
        setRescheduleId(reservation.id);
        setIndex(reservation.id);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [router, reservationDetails]
  );

  const confirmReschedule = useCallback(
    (time: any, reservationDetails:SafeReservation) => {
      axios
        .put(`/api/reservations/${rescheduleId}`, {
          newTime: time,
          rescheduleCount: (reservationDetails.rescheduleCount ?? 0) + 1,
        })
        .then(async () => {
          await sendRescheduleEmail(time,reservationDetails)
          toast.success("Booking rescheduled");
        })
        .catch((error) => {
          console.log("err ", error.message);
          toast.error(
            error?.response?.data?.error || "Failed to reschedule booking"
          );
        })
        .finally(() => {
          setRescheduleId("");
          router.refresh();
        });
    },
    [rescheduleId, router]
  );

  const sendRescheduleEmail=async(time:any,reservationDetails:SafeReservation)=>{
    try {
      const previousTime = format(new Date(reservationDetails.startTime), "PPpp");
      const rescheduledTime = format(new Date(time), "PPpp");
  
      const listingOwner=await getUserById(reservationDetails.listing.userId)  
      if (!listingOwner || !listingOwner.email) {
        throw new Error("Owner not found");
      }
  
      console.log(previousTime, " ", rescheduledTime);
  
      // Send email notification to the owner
      await sendMail({
        email: listingOwner.email,
        userId: currentUser.id,
        emailType: "RESCHEDULE",
        details: { previousTime, rescheduledTime },
      });
    } catch (error) {
      console.error("Error handling reschedule:", error);
      toast.error("Failed to notify the owner about the reschedule");
    }

  }

  return (
    <Container>
      <Heading title="Upcoming" subtitle="Your upcoming appointments" />
      <div
        className="
          mt-10
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {reservations?.map((reservation: any) => (
          <>
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            onReschedule={onReschedule}
            rescheduleLabel="Reschedule booking"
            disabled={deletingId === reservation.id}
            rescheduleDisabled={rescheduleId == reservation.id}
            actionLabel="Cancel booking"
            currentUser={currentUser}
          />
          {index === reservation.id && (
            <RescheduleModal
              reservationDetails={reservationDetails}
              setIndex={setIndex}
              onConfirm={confirmReschedule}
              reserved={reserved}
            />
          )}
          </>
        ))}       
      </div>
    </Container>
  );
};

export default UpcomingClient;
