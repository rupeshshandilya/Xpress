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
import useForgetModal from "@/app/hooks/useForgetModal";

const ForgotModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setisLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const forgetModal = useForgetModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setisLoading(true);
    axios
      .post("/api/forget", data)
      .then(() => {
        forgetModal.onClose();
        toast.success("Please Check your Mail ");
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
      <Heading title="" subtitle="Please Enter Your Email to get password Reset Link" center />

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
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
    </div>
  );
  return (
    <Modal
      disabled={isLoading}
      isOpen={forgetModal.isOpen}
      title="Forgot Password?"
      actionLabel="Continue"
      onClose={forgetModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default ForgotModal;
