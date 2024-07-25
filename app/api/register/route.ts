import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { sendMail } from "@/app/helpers/mailer";


export async function POST(request: Request) {
  try {
    
    const body = await request.json();
    const { email, name, password, phoneNumber } = body;
   
    // Check if a user with the same email or phone number already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { phoneNumber: phoneNumber }],
      },
    });
   
    if (existingUser) {
      return NextResponse.json(
        { error: `User already registered with email: ${email} or phone number: ${phoneNumber}.` },
        { status: 400 }
      );
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    let role: string = "USER";
    if (email === process.env.ADMIN_EMAIL) {
      role = "ADMIN";
    }
    
    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        phoneNumber,
        role,
        isVerified: false,
      },
    });

    

    // Send verification email
    await sendMail({ email, userId: user.id, emailType: "VERIFY" });
    return NextResponse.json(user);
  } catch (error: any) {
    console.log("Error occurred:", error.message);
    return NextResponse.json({
      error: "An error occurred while processing your request. Please try again.",
    });
  }
}
