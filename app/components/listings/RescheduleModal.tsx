"use client";
import React from "react";
import { useMemo, useState, useEffect } from "react";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { cn } from "../datepicker/libs/utils";
import { SafeReservation } from "@/app/types";
import {
  addDays,
  addHours,
  eachDayOfInterval,
  eachMinuteOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameMinute,
  parse,
  parseISO,
  set,
  startOfDay,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

interface RescheduleModalProps {
  setIndex: (index: string | null) => void;
  onConfirm: (arg1: any, arg2: any) => void;
  reservationDetails: SafeReservation | null;
  reserved: SafeReservation[];
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  setIndex,
  onConfirm,
  reservationDetails,
  reserved,
}: RescheduleModalProps) => {
  if (reservationDetails == null) return;

  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [minSelectableDate, setMinSelectableDate] = useState<Date>(new Date());
  const [maxSelectableDate, setMaxSelectableDate] = useState<Date>(new Date());
  const listingTime = reservationDetails.listing.time;
  const listingOffTime = reservationDetails.listing.offTime;
  const [freeTimes, setFreeTimes] = useState<Date[]>([]);

  let today = startOfToday();
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", selectedDate);
  let days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 1 }),
  });
  const reservations = [
    addHours(today, 5).toString(),
    addHours(today, 6).toString(),
    addHours(today, 7).toString(),
    addHours(today, 8).toString(),
    addHours(today, 9).toString(),
    addDays(new Date(addHours(today, 4)), 3).toString(),
  ];

  useMemo(() => {
    if (reservationDetails) {
      const currentDate = new Date(reservationDetails.startDate);
      const maxDate = addDays(currentDate, 7);
      const today = new Date();

      const minDay = currentDate > today ? currentDate : today;
      setSelectedDate(minDay);
      setMinSelectableDate(minDay);
      setMaxSelectableDate(maxDate);
    }
  }, [reservationDetails]);

  useMemo(() => {
    function addHours(date: Date, hours: number) {
      date.setTime(date.getTime() + hours * 60 * 60 * 1000);
      return date;
    }
    const newTime = parseInt(listingTime ?? "10");
    const now = addHours(new Date(), 1);
    const StartOfToday = startOfDay(selectedDate);
    const endOfToday = endOfDay(selectedDate);
    const startHour = set(StartOfToday, { hours: newTime });
    const endHour = set(endOfToday, { hours: 19, minutes: 45 });
    let hoursInDay = eachMinuteOfInterval(
      {
        start: startHour,
        end: endHour,
      },
      { step: 30 }
    );
    let freeTimes = hoursInDay.filter((hour) => {
      const hourISO = parseISO(hour.toISOString());
      return !reservations.includes(hourISO.toString()) && hourISO > now; // Filter out past times
    });
    setFreeTimes(freeTimes);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeClick = (time: Date) => {
    setSelectedTime(time);
  };
  const handleClose = (date: Date) => {
    setIndex(null);
  };
  const handleConfirm = (date: Date) => {
    setIndex(null);
    onConfirm(selectedTime, reservationDetails);
  };
  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      // aria-hidden="true"
      className=" overflow-y-auto overflow-x-hidden md:fixed flex top-1/2 left-1/2 z-[50] justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)]  max-h-full"
    >
      <div
        className="
        relative 
        w-full
        md:w-3/6
        lg:w-3/6
        xl:w-2/5
        my-6
        mx-auto 
        h-full 
        lg:h-auto
        md:h-auto
        
        "
      >
        <div className="bg-slate-200 max-sm:flex-col flex justify-center rounded-md px-8 py-5 gap-2 relative">
          <button
            onClick={() => handleClose(selectedDate)}
            type="button"
            className="end-2.5 absolute top-2 right-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="authentication-modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="flex gap-2 flex-col">
            <h3 className="text-lg max-md:pl-4 sm:text-xl font-semibold text-gray-900 ">
              Select date for {reservationDetails.features.service}
            </h3>
            <Calendar
              color="#000"
              minDate={minSelectableDate}
              maxDate={maxSelectableDate}
              date={selectedDate}
              onChange={handleDateSelect}
            />
            <div className="flex flex-col items-center gap-2 mt-2 ">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 text-md gap-2">
                {freeTimes.map((hour, hourIdx) => {
                  const isReserved = reserved.some((reservation) => {
                    return isSameMinute(new Date(reservation.startTime), hour);
                  });
                  const isOffTime = listingOffTime.includes(
                    format(hour, "HH:mm")
                  );
                  const isDisabled = isReserved || isOffTime;

                  return (
                    <div key={hourIdx}>
                      <button
                        type="button"
                        className={cn(
                          "bg-green-200 rounded-lg px-2 text-gray-800 relative hover:border hover:border-green-400 w-[60px] h-[26px]",
                          selectedTime &&
                            isSameMinute(selectedTime, hour) &&
                            "bg-black text-white",
                          isDisabled && "bg-gray-400 cursor-not-allowed"
                        )}
                        onClick={() => handleTimeClick(hour)}
                        disabled={isDisabled}
                      >
                        {format(hour, "HH:mm")}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <hr />
          <div className="flex flex-col">
            <div className="relative p-4 w-full max-w-md max-h-full  rounded-lg shadow">
              <div className="flex gap-2 items-center">
                <h3 className="text-xl font-semibold text-gray-900 ">
                  Select Date for <br />
                  {reservationDetails.features.service}
                </h3>
              </div>
            </div>
            <hr />
            <button
              onClick={() => handleConfirm(selectedDate)}
              className="bg-black text-white px-4 py-2 text-lg rounded-3xl mt-10 hover:bg-black/20"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
