"use client";
import React from "react";
import ClientOnly from "../ClientOnly";
import useSetupBusiness from "../hooks/useSetupBusiness";

const BussinessPageCreate = ({ center }: any) => {
  const businessModal = useSetupBusiness();
  return (
    <ClientOnly>
      <div className=" h-[60vh] flex-col flex gap-2  justify-center items-center">
        <div className={`${center ? "text-center" : "text-start"} mt-8`}>
          <div className="text-2xl font-bold">No Bussiness</div>
          <div
            className="font-light text-blue-500 mt-2 cursor-pointer"
            onClick={() => businessModal.onOpen()}
          >
            Create a New Bussiness
          </div>
        </div>
      </div>
    </ClientOnly>
  );
};

export default BussinessPageCreate;
