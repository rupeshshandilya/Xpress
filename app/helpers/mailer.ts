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
}

export const sendMail = async ({ email, userId }: sendEmailParams) => {
  const hashedToken = await bcrypt.hash(userId, 10);
  const updateData = {
    verifyToken: hashedToken,
    verifyTokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
  };

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  const message = {
    text: `Click the following link to verify your email: ${process.env.NEXT_PUBLIC_BASE_URL}/verifyemail?token=${hashedToken}`,
    from: "thexpresssalon@gmail.com",
    to: email,
    subject: "Verify Your Email",
  };

  try {
    await client.sendAsync(message);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error; // Rethrow to handle it further up the chain
  }
};