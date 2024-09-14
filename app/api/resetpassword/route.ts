import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { password, token } = body;

    const secret = process.env.JWT_SECRET || "&{'T];l_20|7SL*>&&qIO;67gZ&L/ERwo46#u5G{,%Mcfgsa";

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const userId = decoded.userId;

    const hashPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword: hashPassword }
    });
    return new Response(JSON.stringify({ message: 'Password successfully updated' }), { status: 200 });
  } catch (error: any) {
    console.log(error.message);
  }
}
