"use client";

import { IconType } from "react-icons";
import Avatar from "../Avatar";
import { SafeUser } from "@/app/types";
import ListingCategory from "./ListingCategory";
import Button from "../Button";
import { Feature } from "@prisma/client";
import { Coordinates } from "@prisma/client";
import { useState } from "react";
import ListingEditModal from "./ListingEditModal";
import Link from "next/link";

interface ListingInfoProps {
  user: SafeUser;
  features: Feature[];
  description: string;
  currentUser: SafeUser | null | undefined;
  category:
  | {
    icon: IconType;
    label: string;
    description: string;
  }
  | undefined;
  addFeature: (featureIndex: number) => void;
  editFeatures: any[];
  addEditFeature: (s: string, p: number) => void;
  updateEditFeature: (s: string, p: number, i: number) => void;
  removeEditFeature: (featureIndex: number) => void;
  applyEdits: () => void;
  featureVisibility: boolean[];
  removeOfftime: (i: string) => void;
  addOfftime: (i: string) => void;
  updateOfftime: (i: string, n: number) => void;
  offtimes: string[];
  selectedDate: Date;
  address: string;
  coordinates:Coordinates;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  currentUser,
  user,
  category,
  features,
  editFeatures,
  addEditFeature,
  removeEditFeature,
  updateEditFeature,
  applyEdits,
  addFeature,
  featureVisibility,
  removeOfftime,
  addOfftime,
  updateOfftime,
  offtimes,
  address,
  coordinates,
}) => {
  const [modalVis, setModalVis] = useState(false);
  const handleIsReservationModal = (index: number) => {
    addFeature(index);
  };

  const googleMapLink = (coordinates: Coordinates) => {
    const baseUrl = "https://www.google.com/maps/search/?api=1&query=" ;
    const query = `${coordinates.latitude},${coordinates.longitude}`;
    return baseUrl + encodeURIComponent(query);
  }

  address = googleMapLink(coordinates);

  return (
    <>
      <div className="col-span-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div
            className="
        text-xl 
        font-semibold 
        flex 
        flex-row 
        items-center
        gap-2
      "
          >
            <div>Owner {user?.name}</div>
            <Avatar src={user?.image} />
          </div>
          <div>
            <Link href={address}>
              Click to get Address
            </Link>
          </div>
          <div
            className="
          
            font-light
            text-neutral-500
          "
          >
            <div className="grid grid-cols-3 font-semibold text-black">
              <text>Service</text>
              <div className="ml-5">Price</div>
              <div className=""></div>
            </div>
            {features.map(
              (feature, index) =>
                // eslint-disable-next-line react/jsx-key
                featureVisibility[index] && (
                  // eslint-disable-next-line react/jsx-key
                  <div className="grid grid-cols-3  py-2">
                    <div className="">{feature.service}</div>

                    {` ₹ ${feature.price} `}

                    <div className="flex ">
                      <Button
                        label="Add"
                        onClick={() => handleIsReservationModal(index)}
                      />
                      {currentUser?.id == user.id && (
                        <Button
                          label="Edit"
                          onClick={() => setModalVis(!modalVis)}
                        />
                      )}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>

        <hr />
        {category && (
          <ListingCategory
            icon={category.icon}
            label={category?.label}
            description={category?.description}
          />
        )}
      </div>
      {modalVis && (
        <ListingEditModal
          editFeatures={editFeatures}
          addEditFeature={addEditFeature}
          removeEditFeature={removeEditFeature}
          updateEditFeature={updateEditFeature}
          applyEdits={applyEdits}
          vis={modalVis}
          setVis={setModalVis}
          removeOfftime={removeOfftime}
          addOfftime={addOfftime}
          updateOfftime={updateOfftime}
          offtimes={offtimes}
        />
      )}

    </>
  );
};

export default ListingInfo;
