"use server";
import { Feature } from "@prisma/client";
import { SMTPClient } from "emailjs";

const client = new SMTPClient({
  user: process.env.SMTP_MAIL,
  password: process.env.SMTP_PASSWORD,
  host: process.env.SMTP_HOST,
  ssl: true,
});

interface sendEmailParams {
  email: string;
  details: {
    totalPrice: number;
    startDate: string[];
    startTime: string[];
    listingId: string;
    features: Feature[];
  };
}

export const sendReservationMail = async({
    email,
    details
}: sendEmailParams) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
      };

      const reservationDetails = details.startDate.map((date, index) => {
        return `Date: ${formatDate(date)}, Time: ${formatDate(details.startTime[index])}`;
      }).join("\n");
    
    const featureDetails = details.features.map(f => `${f.service}`);

    // Format the start dates and times into a list
    const formattedDates = details.startDate.map((date, index) => `Date: ${date}`)
  
    // Construct the message text
    // const messageText = `Hello,\n\nA new reservation has been made with the following details:\n\n- Email ID: ${email}\n- Details: \n${formattedDates}\n- Services Reserved: ${featureDetails}\n\nThank you for using our service!`;
    const messageText = `Hello,\n\nA new reservation has been made with the following details:\n\n- Email ID: ${email}\n- Reservation Details:\n${reservationDetails}\n\nThank you for using our service!`;
  
    let message = {
      text: messageText,
      from: "thexpresssalon@gmail.com",
      to: email,
      subject: "There's Reservation in Your Salon",
    };
  
    try {
      await client.sendAsync(message);
    } catch (error) {
        console.log("nooo");
        
      throw error;
    }
}
