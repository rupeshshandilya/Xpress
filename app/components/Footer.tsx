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
          <a href="https://maps.app.goo.gl/T8bQsn6SZL4CXhEG7" className="text-blue-300 hover:text-blue-500">
            Get Directions
          </a>
          <a
            href="mailto:contact@thexpresssalon.com"
            className="text-blue-300 hover:text-blue-500"
          >
            contact@thexpresssalon.com
          </a>
        </div>

        <div className="flex flex-col">
          <span className="font-bold text-xl mb-2">Our Services</span>
          <Link href="/" className="text-blue-300 hover:text-blue-500">
            Salon
          </Link>
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
          <a href="https://www.instagram.com/thexpresssalon?igsh=MWZpYWUxemRvdjlhbg==" className="text-blue-300 hover:text-blue-500">
            Instagram
          </a>
          <a href="https://www.facebook.com/share/FXnCJQsLmruwi8AX/?mibextid=qi2Omg" className="text-blue-300 hover:text-blue-500">
            Facebook
          </a>
          <a href="https://x.com/thexpresssalon?t=Tj70kTSFlcHBfEom0Ni4pQ&s=09" className="text-blue-300 hover:text-blue-500">
            X
          </a>
          <a href="https://www.linkedin.com/company/thexpresssalon/" className="text-blue-300 hover:text-blue-500">
            Linkedin
          </a>
          <a href="https://youtube.com/@thexpresssalon?si=09SkreP9XieIiPPs" className="text-blue-300 hover:text-blue-500">
            Youtube
          </a>
        </div>
      </div>

      <div className="text-center text-sm mt-8">
        © {new Date().getFullYear()}, Changil Abhinav Services Private Limited. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
