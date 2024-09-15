"use client";

import Image from "next/image";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  onReschedule?: (id: any) => void;
  disabled?: boolean;
  rescheduleDisabled?: boolean;
  actionLabel?: string;
  rescheduleLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  revenueMap?: { [key: string]: number };
  dueAmountMap?: { [key: string]: number };
  address?: String;
  distance?: String | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  onReschedule,
  disabled,
  rescheduleDisabled,
  actionId = "",
  actionLabel,
  rescheduleLabel,
  currentUser,
  revenueMap,
  dueAmountMap,
  address,
  distance,
}) => {
  const router = useRouter();
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const handleReschedule = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }
      onReschedule?.(reservation);
    },
    [onReschedule, actionId, reservation]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }
    return data?.price;
  }, [reservation, data?.price]);

  const otp = "otp :" + reservation?.otp;
  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    if (reservation.startTime) {
      return <div>{`${format(new Date(reservation?.startTime), "PPpp")}`}</div>;
    }
  }, [reservation]);
  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-1 w-full">
        <div className="w-full  relative overflow-hidden rounded-xl aspect-square">
          <Image
            src={data.imageSrc}
            alt="image"
            className="h-full w-full object-cover group-hover:scale-110 transition"
            fill
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold text-lg text-black-500">{data.title}</div>
        <div className="font-normal text-base text-black-500">{address}</div>
        {distance && (
          <div className="font-normal text-base text-black-500">
            {distance} km
          </div>
        )}
        <div className="font-semibold text-lg text-black-500">
          {revenueMap && revenueMap.hasOwnProperty(data.id)
            ? `Total Earning: ${revenueMap[data.id]}`
            : null}
        </div>
        <div className="font-semibold text-lg text-black-500">
          {dueAmountMap && dueAmountMap.hasOwnProperty(data.id)
            ? `Due Amount: ${dueAmountMap[data.id]}`
            : null}
        </div>

        <div className=" font-semibold text-sm text-neutral-500">
          {reservationDate || data.category}{" "}
          {currentUser?.id != data.userId && reservation?.totalPrice && otp}
        </div>
        {/* onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        ) */}
        {onReschedule && rescheduleLabel && (
          <Button small label={rescheduleLabel} onClick={handleReschedule} />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
