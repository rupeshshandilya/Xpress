"use server"
import prisma from "../libs/prismadb";
import { SMTPClient } from 'emailjs';
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
  details?:any
}

export const sendMail = async ({ email, userId, emailType,details }: sendEmailParams) => {
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

  if(emailType === "VERIFY"){
     message = {
      text: `Click the following link to verify your email: ${process.env.NEXT_PUBLIC_BASE_URL}/verifyemail?token=${hashedToken}`,
      from: "thexpresssalon@gmail.com",
      to: email,
      subject: "Verify Your Email",
    };
  }
  else if(emailType === "RESCHEDULE"){
    message = {
     text: `Reservation previously scheduled at ${details.previousTime} has been rescheduled to ${details.rescheduledTime}`,
     from: "thexpresssalon@gmail.com",
     to: email,
     subject: "Reservation Rescheduling",
   };
 }
  else{
    if(emailType === "APPROVED"){
      message = {
        text: `Your Salon is Now Listed on our website`,
        from: "thexpresssalon@gmail.com",
        to: email,
        subject: "Salon Approval",
      }
    }
    else{
      message = {
        text: `Your Salon is Now Removed from our website`,
        from: "thexpresssalon@gmail.com",
        to: email,
        subject: "Salon Removed",
      }
    }
  }

  try {
    console.log("message is ",message)
    await client.sendAsync(message);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error; // Rethrow to handle it further up the chain
  }
};