"use client";
import axios from "axios";
import { error } from "console";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const route = useRouter();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getTokenFromUrl = () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const token = urlParams.get("token"); // 'token' is the parameter name
      return token;
    };

    const fetchedToken = getTokenFromUrl();
    if (fetchedToken) {
      setToken(fetchedToken);
    }
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password doesn't match");
      return;
    }

    const data = {
      password,
      confirmPassword,
      token,
    };

    axios
      .patch("/api/resetpassword", data)
      .then(() => {
        toast.success("Password Changed");
        route.push("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
    // Submit password reset logic here
    console.log("Password successfully reset to:", password);
  };

  return (
    // <>
    //   <div className="mt-6">
    //     <form onSubmit={handleSubmit}>
    //       <label htmlFor="password">New Password:</label>
    //       <input
    //         type="password"
    //         id="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />

    //       <label htmlFor="confirmPassword">Confirm Password:</label>
    //       <input
    //         type="password"
    //         id="confirmPassword"
    //         value={confirmPassword}
    //         onChange={(e) => setConfirmPassword(e.target.value)}
    //         required
    //       />

    //       <button type="submit">Reset Password</button>
    //     </form>
    //   </div>
    // </>
    <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 border-2 border-indigo-300">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold dark:text-white">
              Forgot Password?
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="grid gap-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-bold ml-1 mb-2 dark:text-white">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={isVisible ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setIsVisible((prevState) => !prevState)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {isVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold mt-2 ml-1 mb-1 dark:text-white">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
