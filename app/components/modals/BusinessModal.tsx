"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./Modal";
import useSetupBusiness from "@/app/hooks/useSetupBusiness";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import GoogleMaps from "../GoogleMaps";
import { Feature } from "@prisma/client";
import useDebounce from "@/app/hooks/useDebounce";

enum STEPS {
  AADHAAR = 1,
  INFO = 2,
  ADDRESS = 3,
  IMAGES = 6,
  DESCRIPTION = 0,
  PRICE = 7,
  SERVICETYPE = 5,
  SALONTYPE = 4,
}

const daysOfWeek = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

interface Coordinates {
  latitude: number;
  longitude: number;
}

const BusinessModal = () => {
  const [features, setFeatures] = useState<Feature[]>([]);

  const [aadhaar, setAadhaar] = useState("");
  const [isAadhaarValid, setIsAadhaarValid] = useState(false);

  const debouncedAadhaar = useDebounce(aadhaar, 500);

  const [isAadhaar, setisAadhaar] = useState(false);
  const [aadhaarImgFront, setAadhaarImgFront] = useState<File | null>(null);
  const [aadhaarImgBack, setAadhaarImgBack] = useState<File | null>(null);

  const [offTime, setOffTime] = useState<string[]>([]);
  const [offDays, setOffDays] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: 0,
    longitude: 0,
  });

  const businessModal = useSetupBusiness();
  const [step, setStep] = useState(STEPS.DESCRIPTION);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleImageChangeFront = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAadhaarImgFront(e.target.files[0]);
  };
  const handleImageChangeBack = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("called");
    if (!e.target.files) return;
    setAadhaarImgBack(e.target.files[0]);
    console.log(aadhaarImgBack);
  };

  const addOffTime = () => {
    setOffTime([...offTime, ""]);
  };
  const addOffDay = () => {
    setOffDays([...offDays, ""]);
  };
  const addFeature = () => {
    setFeatures([
      ...features,
      {
        service: "",
        price: 0,
      },
    ]); // Add a new empty string to the features array
  };

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await axios.get("/api/addaadhaar");
        if (data.aadhaar) {
          setisAadhaar(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getUser();
  }, []);
  const convertImageToBase64 = (file: File) => {
    try {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const result = reader.result as string | null;
          if (result) {
            resolve(result.split(",")[1]); // Extract base64 data excluding the data URI prefix
          } else {
            reject(new Error("Failed to read file."));
          }
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.log(error);
    }
  };
  // const handleAadhaar = async (e: any) => {
  //   e.preventDefault();
  //   const formEvent = e.target;
  //   const form = new FormData(formEvent);
  //   // Convert front and back images to Base64
  //   const aadhaarFrontImg = form.get("aadhaarFrontImg");
  //   const aadhaarBackImg = form.get("aadhaarBackImg");

  //   if (aadhaarFrontImg && aadhaarBackImg) {
  //     const frontImageBase64 = await convertImageToBase64(
  //       aadhaarFrontImg as File
  //     );
  //     const backImageBase64 = await convertImageToBase64(
  //       aadhaarBackImg as File
  //     );

  //     // Include the Base64-encoded images in the form data
  //     form.set("aadhaarFrontImg", frontImageBase64);
  //     form.set("aadhaarBackImg", backImageBase64);
  //   }

  //   // Send the form data to your server or perform further processing
  //   // (e.g., submitting to MongoDB)
  //   let res = Object.fromEntries(form);

  //   console.log(res);
  //   addAadhaar(res);
  // };

  const addAadhaar = async (aadhaarinfo: {
    aadhaar: string;
    aadhaarFrontImg: string;
    aadhaarBackImg: string;
  }) => {
    try {
      setIsLoading(true);
      const { data } = await axios.patch("/api/addaadhaar", {
        ...aadhaarinfo!,
      });
      if (data) {
        toast.success("Aadhaar added successfully");
        setStep(STEPS.INFO);
      } else {
        toast.error("unable to add Aadhaar number");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureChange = (index: number, value: Feature) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };
  const handleOffTimechange = (index: number, value: string) => {
    const updatedTime: string[] = [...offTime];
    updatedTime[index] = value;
    setOffTime(updatedTime);
  };
  const handleOffDaysChange = (index: number, value: string) => {
    const updatedDays: string[] = [...offDays];
    updatedDays[index] = value;
    setOffDays(updatedDays);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      aadhaar: "",
      category: "",
      time: "",
      offTime: [],
      imageSrc: "",
      price: 1,
      title: "",
      address: "",
      aadhaarFrontImg: "",
      aadhaarBackImg: "",
      description: "",
      salontype: "",
      servicetype: "",
      features: [{ service: "", price: 0 }],
    },
  });
  const category = watch("category");
  const imageSrc = watch("imageSrc");

  function isValid_Aadhaar_Number(aadhaar_number: any) {
    // Regex to check valid
    // aadhaar_number
    let regex = new RegExp(/^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/);

    // if aadhaar_number
    // is empty return false
    return aadhaar_number != null && regex.test(aadhaar_number);
  }

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const onBack = () => {
    setStep((value) => value - 1);
  };
  const onNext = () => {
    if (step === STEPS.AADHAAR && !isAadhaarValid) {
      toast.error("Please enter a valid Aadhaar number to proceed.");
      return;
    }
    if (
      step === STEPS.ADDRESS &&
      coordinates.latitude == 0 &&
      coordinates.longitude == 0
    ) {
      toast.error("Please mark your address on the map to proceed.");
      return;
    }
    setStep((value) => value + 1);
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }
    return "Next";
  }, [step]);

  const removeFeature = () => {
    const updatedFeatures = [...features];
    updatedFeatures.pop();
    setFeatures(updatedFeatures);
  };
  const removeOffTime = () => {
    const updatedOffTime = [...offTime];
    updatedOffTime.pop();
    setOffTime(updatedOffTime);
  };
  const removeOffDay = () => {
    const updatedOffDay = [...offDays];
    updatedOffDay.pop();
    setOffDays(updatedOffDay);
  };

  const getCoordinates = useCallback(
    (lat: number, long: number) => {
      const coords = {
        latitude: lat,
        longitude: long,
      };
      setCoordinates(coords);
    },
    [setCoordinates]
  );

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.DESCRIPTION) {
      return undefined;
    }
    return "Back";
  }, [step]);

  useEffect(() => {
    const valid = isValid_Aadhaar_Number(debouncedAadhaar);
    setIsAadhaarValid(valid);
    if (!valid && debouncedAadhaar.length === 14) {
      toast.error("Invalid Aadhaar number format.");
    }
  }, [debouncedAadhaar]);

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAadhaar(e.target.value);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    const { aadhaar, aadhaarFrontImg, aadhaarBackImg } = data;
    if (aadhaar || aadhaarFrontImg || aadhaarBackImg) {
      const frontImageBase64 = await convertImageToBase64(
        aadhaarFrontImg[0] as File
      );
      const backImageBase64 = await convertImageToBase64(
        aadhaarBackImg[0] as File
      );
      await addAadhaar({
        aadhaar,
        aadhaarBackImg: backImageBase64 as string,
        aadhaarFrontImg: frontImageBase64 as string,
      });
    }

    setIsLoading(true);

    axios
      .post("/api/listings", {
        ...data,
        features,
        offTime,
        offDays,
        coordinates,
        SalonType: data.salontype,
        ServiceType: data.servicetype,
      })
      .then(() => {
        // addAadhaar(data.aadhaar);
        toast.success("Wait for Approval!");
        router.refresh();
        reset();
        setStep(STEPS.DESCRIPTION);
        businessModal.onClose();
      })
      .catch((error) => {
        toast.error("Something went wrong.");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const sortByName = (a: any, b: any) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  };

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="How would you describe your business?"
        subtitle="Short and sweet works best!"
      />
      <Input
        id="title"
        label="Title"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <hr />
      <Input
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  if (step === STEPS.AADHAAR) {
    if (isAadhaar) {
      setStep(STEPS.INFO);
    }
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading title="Required Aadhaar Number" />
        <div>Give space wherever space present in the Aadhaar</div>
        <Input
          id="aadhaar"
          label="aadhaar"
          disabled={isLoading}
          register={register}
          onChange={handleAadhaarChange}
          errors={errors}
          required
          type="text"
          accept=".jpg, .jpeg, .png"
          maxLength={14}
        />
        <h1>Front Image of Aadhaar</h1>
        <Input
          type="file"
          id="aadhaarFrontImg"
          register={register}
          errors={errors}
          accept=".jpg, .jpeg, .png"
          required
        />
        <h1>Back Image of Aadhaar</h1>

        <Input
          type="file"
          id="aadhaarBackImg"
          register={register}
          errors={errors}
          accept=".jpg, .jpeg, .png"
          required
        />
      </div>
    );
  }
  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some details about your business"
          subtitle="What service do you provide?"
        />
        <div>
          <div className="flex flex-col gap-2">
            {features.map((feature, index) => (
              // eslint-disable-next-line react/jsx-key
              <div className="flex gap-8 ">
                <input
                  key={index}
                  className="border p-2"
                  value={feature.service}
                  onChange={(e) =>
                    handleFeatureChange(index, {
                      ...feature,
                      service: e.target.value,
                    })
                  }
                  disabled={isLoading}
                />
                <input
                  key={index}
                  id="price"
                  type="number"
                  className="border border-solid "
                  onChange={(e) =>
                    handleFeatureChange(index, {
                      ...feature,
                      price: parseInt(e.target.value),
                    })
                  }
                  disabled={isLoading}
                  required
                />
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              className="mt-2 bg-blue-500 text-white p-2 rounded"
              onClick={addFeature}
            >
              + Add Service
            </button>
            <button
              type="button"
              className="mt-2 bg-red-500 text-white p-2 rounded"
              onClick={removeFeature}
            >
              - Remove Service
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your business"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue("imageSrc", value)}
          value={imageSrc}
        />
      </div>
    );
  }

  if (step === STEPS.ADDRESS) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Give Address Of Your Salon"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="address"
          label="Address"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Heading title="Mark your location on Map" />
        <GoogleMaps onSelect={getCoordinates} />
      </div>
    );
  }

  if (step === STEPS.SERVICETYPE) {
    bodyContent = (
      <div>
        <label className="text-gray-900 font-medium block mt-4 mb-2">
          Mode of Service
        </label>
        <select
          id="servicetype"
          {...register("servicetype", { required: true })}
          className="form-select w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => {
            setCustomValue("servicetype", e.target.value);
          }}
        >
          <option value="">Select Service</option>
          <option value="SALON">Salon</option>
          <option value="HOME">Home</option>
        </select>
      </div>
    );
  }

  if (step === STEPS.SALONTYPE) {
    bodyContent = (
      <div>
        <label className="text-gray-900 font-medium block mt-4 mb-2">
          Client Category
        </label>
        <select
          id="salontype"
          {...register("salontype", { required: true })}
          className="form-select w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => {
            setCustomValue("salontype", e.target.value);
          }}
        >
          <option value="">Select Category</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="UNISEX">Unisex</option>
        </select>
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Now, set your  time" />
        <Input
          id="time"
          label="Time in hh/mm"
          type="time"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Heading title="Now set your off hours" />

        <div className="flex gap-2 flex-wrap">
          {offTime.map((time, index) => (
            <div className="flex gap-8 ">
              <input
                key={index}
                className="border p-2"
                type="time"
                value={time}
                onChange={(e) => handleOffTimechange(index, e.target.value)}
                disabled={isLoading}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="mt-2 bg-blue-500 text-white p-2 rounded"
            onClick={addOffTime}
          >
            Add offtime
          </button>
          <button
            type="button"
            className="mt-2 bg-red-500 text-white p-2 rounded"
            onClick={removeOffTime}
          >
            Remove offtime
          </button>
        </div>
        <Heading title="Now set your off days" />

        <div className="flex gap-2 flex-wrap">
          {offDays.map((day, index) => {
            const availableDays = daysOfWeek.filter(
              (dayOption) =>
                !offDays.includes(dayOption.value) || dayOption.value === day
            );
            return (
              <div className="flex gap-8" key={index}>
                <select
                  className="border p-2"
                  value={day}
                  onChange={(e) => handleOffDaysChange(index, e.target.value)}
                  disabled={isLoading}
                >
                  <option value="" disabled>
                    Select a day
                  </option>
                  {availableDays.map((dayOption) => (
                    <option key={dayOption.value} value={dayOption.value}>
                      {dayOption.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="mt-2 bg-blue-500 text-white p-2 rounded"
            onClick={addOffDay}
          >
            Add offDays
          </button>
          <button
            type="button"
            className="mt-2 bg-red-500 text-white p-2 rounded"
            onClick={removeOffDay}
          >
            Remove offdays
          </button>
        </div>
      </div>
    );
  }

  return (
    <Modal
      title="Your Business"
      isOpen={businessModal.isOpen}
      onClose={businessModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.DESCRIPTION ? undefined : onBack}
      body={bodyContent}
      disabled={isLoading}
    />
  );
};

export default BusinessModal;
