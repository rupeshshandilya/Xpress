"use server";
import prisma from "../libs/prismadb";
import { SMTPClient } from "emailjs";
import bcrypt from "bcrypt";

const client = new SMTPClient({
  user: process.env.SMTP_MAIL,
  password: process.env.SMTP_PASSWORD,
  host: process.env.SMTP_HOST,
  ssl: true,
});

interface sendEmailParams {
  email: string;
  userId: string;
  emailType: string;
  details?: any;
  resetLink?: string;
}

export const sendMail = async ({
  email,
  userId,
  emailType,
  details,
  resetLink,
}: sendEmailParams) => {
  const hashedToken = await bcrypt.hash(userId, 10);
  const updateData = {
    verifyToken: hashedToken,
    verifyTokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
  };

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  let message;

  switch (emailType) {
    case "VERIFY":
      message = {
        text: `Click the following link to verify your email: ${process.env.NEXT_PUBLIC_BASE_URL}/verifyemail?token=${hashedToken}`,
        from: "thexpresssalon@gmail.com",
        to: email,
        subject: "Verify Your Email",
      };
      break;
    case "APPROVED":
      message = {
        text: `Your Salon is Now Listed on our website`,
        from: "thexpresssalon@gmail.com",
        to: email,
        subject: "Salon Approval",
      };
      break;
    case "RESCHEDULE":
      message = {
        text: `Reservation previously scheduled at ${details.previousTime} has been rescheduled to ${details.rescheduledTime}`,
        from: "thexpresssalon@gmail.com",
        to: email,
        subject: "Reservation Rescheduling",
      };
      break;

    case "FORGOT":
      message = {
        text: `You have requested to reset your password. Click this link to proceed: ${process.env.NEXT_PUBLIC_BASE_URL}/forgotpassword?token=${resetLink}`,
        from: "thexpresssalon@gmail.com",
        to: email,
        subject: "Forgot Password",
      }
      break;

    default:
      message = {
        text: `Your Salon is Now Removed from our website`,
        from: "thexpresssalon@gmail.com",
        to: email,
        subject: "Salon Removed",
      };
  }

  try {
    await client.sendAsync(message);
  } catch (error) {
    throw error;
  }
};
