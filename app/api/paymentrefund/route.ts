import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_APT_SECRET!,
});

interface Props {
  amount: string;
  paymentId: string;
}

export async function POST(req: Request) {

  function generateUniqueReceiptNumber() {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000); // Random number between 0 and 999
    return `Receipt_${timestamp}_${randomPart}`;
  }
  
  try {
    const body: unknown = await req.json();
    const { amount, paymentId } = body as Props;
    
    console.log("Heya ", amount, paymentId);
    
    
    const receiptNumber=generateUniqueReceiptNumber()
    // Convert the amount to paise
    const paiseAmount = Math.round(parseFloat(amount) * 100);

    const refundData = {
      amount: paiseAmount,
      speed: 'optimum',
      receipt: receiptNumber,
    };

    // Create a refund using the Razorpay instance
    const response = await instance.payments.refund(paymentId, refundData);

    console.log('Refund successful:', response);
    return NextResponse.json(response);
  } catch (error:any) {
    console.error('Refund error:', error);
    console.error('Arnold', error.message);
    return NextResponse.json({ error: error.message });
  }
}





/* import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import {Buffer} from 'buffer'
import axios from 'axios';

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_APT_SECRET!,
});

interface Props{
  amount:string;
  paymentId:string;
}

export async function POST(req: Request) {
  
  const body: unknown = await req.json();
  const { amount,paymentId } = body as Props;
  const razorpayApiUrl = `https://api.razorpay.com/v1/payments/${paymentId}/refund`;
  const auth = Buffer.from(`${process.env.RAZORPAY_API_KEY}:${process.env.RAZORPAY_APT_SECRET}`).toString('base64');
  
  console.log("Heya ",amount,paymentId)
  const paiseAmount=Math.round(parseFloat(amount)*100);

  const refundData = {
    speed: 'optimum',
    receipt: 'Receipt No. 2',
    notes: {
      'notes_key_1': 'Tea Earl Grey, Hot',
      'notes_key_2': 'Tea Earl Grey… decaf.'
    }
  };
  
  axios.post(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, refundData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    }
  })
  .then(response => {
    console.log('Refund successful:', response.data);
    return NextResponse.json(response)
  })
  .catch(error => {
    console.error('Refund error:', error);
    console.error('Arnold:', error.message);
    return NextResponse.json(error.data)
  });
} */