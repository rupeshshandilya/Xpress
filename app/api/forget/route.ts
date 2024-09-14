import { sendMail } from "@/app/helpers/mailer";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {email} = body;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            return NextResponse.json(
                { error: `User with Email id ${email} does not exist` },
                { status: 400 }
              );
        }
        const secret = process.env.JWT_SECRET || "&{'T];l_20|7SL*>&&qIO;67gZ&L/ERwo46#u5G{,%Mcfgsa";

        const resetToken = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
      
        await sendMail({email, userId: user.id,emailType:"FORGOT", resetLink: resetToken})
        return new Response(JSON.stringify({ message: 'Reset link sent to your email' }), { status: 200 });
    } catch (error) {
        console.log(error);
        
    }
}