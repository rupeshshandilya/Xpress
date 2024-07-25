"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="bg-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-start gap-8">
        <div className="flex items-center mb-6 md:mb-0 mx-auto">
          <Image
            src="/images/companylogo.png"
            height="200"
            width="200"
            alt="Logo"
          />
        </div>
        <div className="flex flex-col justify-between">
          {/* <span className="font-bold text-xl mb-2">Loveland, CO</span> */}
          <address className="not-italic">
          128, SAIMPAL, Kalanaur, Rohtak, <br />
          Rohtak- 124113, Haryana, India
          </address>
          <a href="#" className="text-blue-300 hover:text-blue-500">
            Get Directions
          </a>
          <a
            href="tel:8199859921"
            className="text-blue-300 hover:text-blue-500"
          >
            Phone: +91 8199859921
          </a>
        </div>

        <div className="flex flex-col">
          <span className="font-bold text-xl mb-2">Our Services</span>
          <Link href="/" className="text-blue-300 hover:text-blue-500">
            Salon
          </Link>
          {/* <a href="#" className="text-blue-300 hover:text-blue-500">
            Med Aesthetics
          </a>
          <a href="#" className="text-blue-300 hover:text-blue-500">
            Spa
          </a>
          <a href="#" className="text-blue-300 hover:text-blue-500">
            Massage
          </a>
          <a href="#" className="text-blue-300 hover:text-blue-500">
            Nail Spa
          </a> */}
        </div>

        <div className="flex flex-col">
          <span className="font-bold text-xl mb-2">Company</span>
          <div
            onClick={() => router.push("/refundpolicy")}
            className="text-blue-300 hover:text-blue-500 cursor-pointer"
          >
            Refund Policy
          </div>
          <div
            onClick={() => router.push("/about")}
            className="text-blue-300 hover:text-blue-500 cursor-pointer"
          >
            About Us
          </div>
          <div
            onClick={() => router.push("/cancellationpolicy")}
            className="text-blue-300 hover:text-blue-500 cursor-pointer"
          >
            Cancellation Policy
          </div>
          <div
            onClick={() => router.push("/contactus")}
            className="text-blue-300 hover:text-blue-500 cursor-pointer"
          >
            Contact us
          </div>
          <div
            onClick={() => router.push("/privacy-policy")}
            className="text-blue-300 hover:text-blue-500 cursor-pointer"
          >
            Policies
          </div>
        </div>

        <div className="flex flex-col">
          <span className="font-bold text-xl mb-2">Stay Updated</span>
          {/* <a href="#" className="text-blue-300 hover:text-blue-500">
            Facebook
          </a> */}
          <a href="https://www.instagram.com/thexpresssalon?igsh=MW1vb3E0Y3B2YzQzdg==" className="text-blue-300 hover:text-blue-500">
            Instagram
          </a>
        </div>
      </div>

      <div className="text-center text-sm mt-8">
        © {new Date().getFullYear()}, TheXpressSalon. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
