"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import { signIn } from "next-auth/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setisLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setisLoading(true);
    axios
      .post("/api/register", data)
      .then(() => {
        registerModal.onClose();
        toast.success("Please Verify Mail! ");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error || "Something went wrong";
        toast.error(errorMessage);
      })
      .finally(() => setisLoading(false));
  };

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to TheXpressSalon" subtitle="Create an account!" center />

      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        required
        errors={errors}
      />
      <Input
        id="phoneNumber"
        label="Phone Number"
        disabled={isLoading}
        register={register}
        required
        type="number"
        errors={errors}
        maxLength={10}
      />
      <Input
        type="email"
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        required
        errors={errors}
        pattern="^[a-zA-Z0-9._%+-]+@(gmail\.com|icloud\.com)$"
      />
      <Input
        id="password"
        label="Password"
        type={isVisible ? "text" : "password"}
        disabled={isLoading}
        register={register}
        required
        errors={errors}
        icon={
          isVisible ? (
            <FaEyeSlash onClick={() => setIsVisible(false)} />
          ) : (
            <FaEye onClick={() => setIsVisible(true)} />
          )
        }
        iconPosition="right"
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      {/* <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      /> */}
      <div
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>
          Already have an account?
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
