"use client";
import React from "react";
import { useMemo, useState } from "react";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { cn } from "../datepicker/libs/utils";
import { SafeReservation } from "@/app/types";
import { Feature } from "@prisma/client";
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
import toast from "react-hot-toast";

interface ListingReservationModalProps {
  time: string;
  offTime: string[];
  offDays: string[];
  selectedDate: Date;
  reserved: SafeReservation[];
  features: Feature[];
  handleTimeSelect: (time: Date) => void;
  setSelectedDate: (date: Date) => void;
  onSelect: (date: Date) => void;
  modalKey: number;
  setIndex: (index: number | null) => void;
  setSelectedTimeFeature: (value: any) => void;
  selectedTimeFeature: Date[];
}

const ListingReservationModal: React.FC<ListingReservationModalProps> = ({
  time,
  offTime,
  offDays,
  selectedDate,
  reserved = [],
  features,
  handleTimeSelect,
  setSelectedDate,
  onSelect,
  modalKey,
  setIndex,
  setSelectedTimeFeature,
  selectedTimeFeature, // Make sure this is included
}: ListingReservationModalProps) => {
  let nextDay = addHours(addDays(new Date().setMinutes(0), 0), 2);
  let test = new Date();
  if (test.getHours() > 19) {
    nextDay = addHours(nextDay, 24 - test.getHours() + 8);
  } else if (test.getHours() < 10) {
    nextDay = addHours(nextDay, 8 - test.getHours());
  }

  const date = new Date();
  let todayDate = date.getDate();

  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onSelect(date);
  };
  const handleDisabledDays = (date: Date): boolean => {
    // Your logic to determine if the date should be disabled
    // For example:
    const today = new Date();
    return date < today; // Disable past dates
  };
  const minSelectableDate = addDays(new Date(), 0);

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

  const [freeTimes, setFreeTimes] = useState<Date[]>([]);
  useMemo(() => {
    //filter out past times from freeTimes array to prevent booking in the past
    function addHours(date: Date, hours: number) {
      date.setTime(date.getTime() + hours * 60 * 60 * 1000);
      return date;
    }
    const newTime = parseInt(time);
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

  const handleTimeClick = (time: Date) => {
    setSelectedTime(time);
    handleTimeSelect(time);
    setSelectedTimeFeature((prev: any) => {
      const temp = [...prev];
      temp[modalKey] = time;
      return temp;
    });
  };
  const handleClose = (date: Date) => {
    setIndex(null);
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
              Select date for ( {features[modalKey]?.service} )
            </h3>
            <Calendar
              color="#000"
              minDate={minSelectableDate}
              date={selectedDate}
              onChange={handleDateSelect}
              disabledDay={(date) => {
                return offDays.includes(date.getDay().toString());
              }}
            />
            <div className="flex flex-col items-center gap-2 mt-2 ">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 text-md gap-2">
                {freeTimes.map((hour, hourIdx) => {
                  const isReserved = reserved.some((reservation) => {
                    /* return reservation.startTime.some(startTime => */
                    return isSameMinute(new Date(reservation.startTime), hour);
                    /* ); */
                  });
                  const isOffTime = offTime.includes(format(hour, "HH:mm"));
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
                  {features[modalKey].service}
                </h3>
              </div>
            </div>
            <hr />
            <button
              onClick={() => handleClose(selectedDate)}
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

export default ListingReservationModal;
