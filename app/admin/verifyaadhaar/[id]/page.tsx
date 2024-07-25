"use client";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const VerifyAadhaar = () => {
  const params = useParams();
  const id = params?.id;
  const [user, setUser] = useState(null);
  const [aadhaarImgSrcFront, setAadhaarImgSrcFront] = useState(null);
  const [aadhaarImgSrcBack, setAadhaarImgSrcBack] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`/api/addaadhaar/${id}`);
        setUser(res.data);
        setAadhaarImgSrcFront(res.data.aadhaarImgSrcFront);
        setAadhaarImgSrcBack(res.data.aadhaarImgSrcBack);
      } catch (error) {
        alert(`Error! ${error}`);
      }
    }

    if (id) {
      fetchUser();
    }
  }, [id]);

  return (
    <>
      {aadhaarImgSrcBack ? (
        <div className="flex items-center gap-4 justify-center flex-wrap h-auto pt-10 md:h-[50vh] md:gap-10 md:pt-20">
          <Image alt="Front of Aadhaar Card" src={`data:image/jpeg;base64,${aadhaarImgSrcFront}`} width={160} height={120} className="md:w-200 md:h-150" />
          <Image alt="Back of Aadhaar Card" src={`data:image/jpeg;base64,${aadhaarImgSrcBack}`} width={160} height={120} className="md:w-200 md:h-150" />
        </div>
      ) : (
        <div className="flex items-center gap-10 justify-center flex-wrap h-auto pt-10">Loading...</div>
      )}
      <div className="flex items-center mt-8 md:mt-14">
        <a href="/admin" className="m-auto">
          <button className="bg-gray-800 text-white px-6 py-3 rounded text-sm md:px-4 md:py-3 md:text-base">Go back</button>
        </a>
      </div>
    </>
  );
};

export default VerifyAadhaar;
