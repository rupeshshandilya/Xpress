"use client";
import { Range } from "react-date-range";
import { useCallback, useMemo, useState } from "react";
import { categories } from "@/app/components/navbar/Categories";
import { SafeListing, SafeUser, SafeReservation } from "@/app/types";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import ListingReservation from "@/app/components/listings/ListingReservation";
import { Feature } from "@prisma/client";
import Reviews from "@/app/reviewsClient/Review";
import Button from "../../components/Button";
import {
  addDays,
  eachMinuteOfInterval,
  endOfDay,
  isSameMinute,
  parseISO,
  set,
  startOfDay,
  startOfToday,
} from "date-fns";
import Razorpay from "razorpay";
import { sendReservationMail } from "@/app/helpers/reservationMail";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  listing: SafeListing & { user: SafeUser };
  currentUser?: SafeUser | null;
  reserved?: SafeReservation[];
}

declare global {
  interface Window {
    Razorpay: any; // Specify the correct type for Razorpay if possible
  }
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
  reserved = [],
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const tomorrow = new Date();

  let currentTime = new Date().getHours();
  currentTime = currentTime % 12 || 12;

  if (new Date().getHours() > 20) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }

  const [selectedDate, setSelectedDate] = useState<Date>(tomorrow);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);

  function addHours(date: Date, hours: number) {
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    return date;
  }

  const newTime = parseInt(listing.time!.toString());
  const now = addHours(new Date(), 1);
  const StartOfToday = startOfDay(selectedDate);
  const endOfToday = endOfDay(selectedDate);
  const startHour = set(StartOfToday, { hours: newTime });
  const endHour = set(endOfToday, { hours: 21, minutes: 30 });
  let hoursInDay = eachMinuteOfInterval(
    {
      start: startHour,
      end: endHour,
    },
    { step: 30 }
  );
  let today = startOfToday();

  const reservations = [
    addHours(today, 5).toString(),
    addHours(today, 6).toString(),
    addHours(today, 7).toString(),
    addHours(today, 8).toString(),
    addHours(today, 9).toString(),
    addDays(new Date(addHours(today, 4)), 3).toString(),
  ];

  const allDisableDates = reserved?.flatMap(
    (reservation) => reservation.startDate
  );
  const [reservedTimeDates, setReservedTimeDates] = useState(allDisableDates);
  let freeTimes = hoursInDay.filter((hour) => {
    const hourISO = parseISO(hour.toISOString());
    const hourString = hourISO.toString();
    return (
      !reservations.includes(hourString) &&
      !reservedTimeDates.some((disabledDate) =>
        isSameMinute(new Date(disabledDate), hourISO)
      ) &&
      hourISO > now
    ); // Filter out past times
  });
  console.log(`free times: ${freeTimes}`);

  /* const [selectedTimeFeature, setSelectedTimeFeature] =
    useState<Date[]>([]); */

  const [selectedTimeFeature, setSelectedTimeFeature] = useState(freeTimes);

  console.log(`free time: ${selectedTimeFeature}`);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time);
  };

  const disableDates = useMemo(() => {
    const disabledDates: Date[] = reserved.map(
      (reservation: any) => new Date(reservation.startDate)
    );
    return disabledDates;
  }, [reserved]);

  const [isLoading, setIsLoading] = useState(false);
  const taxRate = 0.05;
  const taxPrice = listing.price * taxRate;
  const total = (listing?.price + taxPrice).toFixed(2);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [editFeatures, setEditFeatures] = useState(
    listing.features.map((feature) => ({
      service: feature.service,
      price: feature.price,
    }))
  );

  const [offTimes, setOffTime] = useState(
    listing.offTime.length == 0 ? [] : listing.offTime
  );
  const removeOffTime = (t: string) => {
    let f = offTimes;
    f = f.filter((time) => time !== t);
    setOffTime(f);
  };
  const addOffTime = (t: string) => {
    console.log(t);
    if (t.length == 0) {
      toast.error("Please enter a valid Time");
    } else if (offTimes.includes(t)) {
      toast.error("Time already added");
    } else {
      const f = offTimes;
      f.push(t);
      setOffTime(f);
    }
  };
  const updateOfftime = (t: string, i: number) => {
    const f = offTimes;
    f[i] = t;
    setOffTime(f);
  };
  const applyOfftime = () => {
    axios
      .patch(`http://localhost:3000/api/listings/${listing.id}`, {
        offTime: offTimes,
        features: editFeatures,
      })
      .then((e) => {
        console.log(e.data);
      })
      .catch((error) => {
        toast.error("Something Went Wrong : " + error);
      })
      .finally(() => {
        window.location.reload();
      });
  };

  const removeEditfeature = async (index: number) => {
    let f = [];
    for (let i = 0; i < editFeatures.length; i++) {
      if (index !== i) {
        f.push({
          service: editFeatures[i].service,
          price: editFeatures[i].price,
        });
      }
    }
    await setEditFeatures(f);
    console.log(editFeatures);
  };
  const addEditfeature = (s: string | undefined, p: number | undefined) => {
    if (s == "" || p == 0) {
      toast.error("Please enter a valid Service and Price");
      return;
    }
    const f = editFeatures;
    f.push({
      service: s!,
      price: p!,
    });
    setEditFeatures(f);
    console.log(editFeatures);
  };
  const updateEditfeature = async (s: string, p: number, i: number) => {
    let f = editFeatures;
    f[i].service = s;
    f[i].price = p;
    setEditFeatures(f);
    console.log(editFeatures);
  };

  const applyEdits = () => {
    axios
      .patch(`/api/listings/${listing.id}`, {
        features: editFeatures,
        offTime: offTimes,
      })
      .then((e) => {
        console.log(e.data);
      })
      .catch((error) => {
        toast.error("Something Went Wrong : " + error);
      })
      .finally(() => {
        window.location.reload();
      });
  };
  const onCreateReservation = useCallback(async () => {
    console.log(selectedFeatures);
    if (selectedFeatures.length == 0) {
      toast.error("Please select a Service");
      return;
    }
    const total = selectedFeatures.reduce(
      (previous, current) => previous + current.price,
      0
    );
    console.log(total);
    const totalPriceAfterTax = (total + total * taxRate).toFixed(2);
    console.log(totalPriceAfterTax);
    const checkForDuplicates = (array: Date[]) => {
      const dateSet = new Set();
      for (const date of array.slice(0, selectedFeatures.length)) {
        if (dateSet.has(date.toISOString())) {
          return true;
        }
        dateSet.add(date.toISOString());
      }
      return false;
    };
    if (checkForDuplicates(selectedTimeFeature)) {
      toast.error(
        "Duplicate dates are not allowed. Please choose different time"
      );
      return;
    }
    if (!currentUser) {
      return loginModal.onOpen();
    }
    setIsLoading(true);
    const makePayment = async () => {
      console.log(`totalPriceAfterTax: ${totalPriceAfterTax}`);

      try {
        const key = process.env.RAZORPAY_API_KEY;
        const data = await fetch("http://localhost:3000/api/razorpay", {
          method: "POST",
          body: JSON.stringify({
            totalPriceAfterTaxid: parseFloat(totalPriceAfterTax),
          }),
        });
        const { order } = await data.json();
        const options = {
          key: key as string,
          name: "Xpress",
          currency: order.currency,
          amount: order.amount,
          order_id: order.id,
          description: "Pay For Service",
          // image: logoBase64,
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: any;
            razorpay_signature: any;
          }) {
            console.log("HERE" + response);
            const data = await fetch(
              "http://localhost:3000/api/paymentverify",
              {
                method: "POST",
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const res = await data.json();

            console.log("response verify==", res);

            if (res?.message == "success") {
              fetch("http://localhost:3000/api/paymentregister", {
                method: "POST",
                body: JSON.stringify({
                  listingId: listing?.id,
                  price: totalPriceAfterTax,
                  title: listing?.title,
                  category: listing?.category,
                }),
              })
                .then((res) => {
                  if (res) {
                    const reservationDetails = {
                      totalPrice: parseInt(totalPriceAfterTax),
                      startDate: selectedTimeFeature.map((date) =>
                        date.toISOString()
                      ),
                      startTime: selectedTimeFeature.map((date) =>
                        date.toISOString()
                      ),
                      listingId: listing.id,
                      features: selectedFeatures,
                    };
                    const saveRes = async () => {
                      await axios
                        .post(
                          "http://localhost:3000/api/reservations",
                          reservationDetails
                        )
                        .then((response) => {
                          toast.success("Reserved Successfully");
                        });
                    };
                    saveRes()
                      .then(() => {
                        const mailReservationDetails = {
                          totalPrice: parseInt(totalPriceAfterTax),
                          startDate: selectedTimeFeature.map((date) =>
                            date.toISOString()
                          ),
                          startTime: selectedTimeFeature.map((date) =>
                            date.toISOString()
                          ),
                          listingId: listing.id,
                          features: selectedFeatures,
                        }
                        sendReservationMail({
                          email: listing.user.email,
                          details: mailReservationDetails 
                        });
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
              console.log("redirected.......");
              toast.success("Success");
              setDateRange(initialDateRange);
              router.refresh();
              const res = await fetch(
                "http://localhost:3000/api/paymentregister",
                {
                  method: "POST",
                  body: JSON.stringify({
                    listingId: listing.id,
                    price: totalPriceAfterTax,
                  }),
                }
              );
              router.push("/upcoming");
              if (!res) throw new Error();
            }
          },
          prefill: {
            name: "Xpress",
            email: currentUser?.email || "",
            contact: currentUser?.phoneNumber,
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function () {
          toast.error("Something went wrong");
        });
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong" + err);
      } finally {
        setIsLoading(false);
      }
    };

    await makePayment();
  }, [
    selectedTimeFeature,
    selectedFeatures,
    router,
    totalPrice,
    currentUser,
    loginModal,
    listing?.id,
    listing?.category,
    listing?.title,
  ]);

  const cate = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  const [featureVisibility, setFeatureVisibility] = useState<boolean[]>(
    listing.features.map(() => true)
  );
  const addSelectedFeatures = (featureIndex: number) => {
    const selectedFeature = listing.features[featureIndex];
    if (selectedFeature && !selectedFeatures.includes(selectedFeature)) {
      setSelectedFeatures((prevSelectedFeatures) => [
        ...prevSelectedFeatures,
        selectedFeature,
      ]);
      setFeatureVisibility((prevVisibility) =>
        prevVisibility.map((isVisible, index) =>
          index === featureIndex ? false : isVisible
        )
      );
    }
  };

  const removeFeature = (featureIndex: number) => {
    const featureNameToRemove = selectedFeatures[featureIndex].service;

    setSelectedFeatures((prevFeatures) =>
      prevFeatures.filter((_, index) => index !== featureIndex)
    );

    setFeatureVisibility((prevVisibility) =>
      prevVisibility.map((isVisible, index) => {
        const currentFeature = listing.features[index];
        return currentFeature && currentFeature.service === featureNameToRemove
          ? true
          : isVisible;
      })
    );
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col gap-6">
        <ListingHead
          title={listing.title}
          imageSrc={listing.imageSrc}
          id={listing.id}
          currentUser={currentUser}
          listing={listing}
          user={listing.user}
          category={cate}
        />

        <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-4 px-8 sm:px-24">
          <div className="md:col-span-4">
            <ListingInfo
              currentUser={currentUser}
              features={listing.features}
              addFeature={addSelectedFeatures}
              editFeatures={editFeatures}
              addEditFeature={addEditfeature}
              removeEditFeature={removeEditfeature}
              updateEditFeature={updateEditfeature}
              applyEdits={applyEdits}
              user={listing.user}
              category={cate}
              description={listing.description}
              featureVisibility={featureVisibility}
              removeOfftime={removeOffTime}
              addOfftime={addOffTime}
              updateOfftime={updateOfftime}
              offtimes={offTimes}
              selectedDate={selectedDate}
              address={listing?.address}
              coordinates={listing.coordinates}
            />
            <Reviews
              listingId={listing.id}
              userId={listing.userId}
              currentUser={currentUser}
            />
          </div>
          <div className="order-first mb-10 md:order-last md:col-span-3">
            {/* <ListingReservation
              selectedTimeFeature={selectedTimeFeature}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              removeFeature={removeFeature}
              features={selectedFeatures}
              offDays={listing.offDays}
              offTime={listing.offTime}
              price={listing.price}
              totalPrice={totalPrice}
              time={listing.time!.toString()}
              onChangeDate={(value) => setDateRange(value)}
              dateRange={dateRange}
              disabled={isLoading}
              onSubmit={onCreateReservation}
              disableDates={disableDates}
              onSelect={handleDateSelect}
              handleTimeSelect={handleTimeSelect}
              reserved={reserved}
              setSelectedTimeFeature={setSelectedTimeFeature}
            /> */}
             {/* <Button label="Reserve"  /> */}
             <p 
             className="text-xl border border-black text-center p-3 first-letter rounded-md bg-black text-white"
             >
              Booking Starting soon
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingClient;
