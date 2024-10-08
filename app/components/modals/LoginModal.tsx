"use client";

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useForgetModal from "@/app/hooks/useForgetModal";

const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const forgetModal = useForgetModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.success("Logged in");
        router.push("/");
        router.refresh();
        loginModal.onClose();
      }
      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const openForgetModal = useCallback(() => {
    forgetModal.onOpen();
    loginModal.onClose();
  }, []);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login to your account!" />
      <Input
        id="email"
        label="Email"
        type="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        pattern="^[a-zA-Z0-9._%+-]+@(gmail\.com|icloud\.com)$"
      />

      <Input
        id="password"
        label="Password"
        type={isVisible ? "text" : "password"}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        icon={
          isVisible ? (
            <FaEyeSlash onClick={() => setIsVisible(false)} />
          ) : (
            <FaEye onClick={() => setIsVisible(true)} />
          )
        }
        iconPosition="right"
      />
      <div className="flex justify-end">
      <p className="cursor-pointer text-right" onClick={openForgetModal}>
        Forget Password?
      </p>
    </div>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4">
      <hr />
      {/* <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      /> */}
      <div
        className="
      text-neutral-500 text-center font-light"
      >
        <p>
          First time using TheXpressSalon?
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Create an account
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
