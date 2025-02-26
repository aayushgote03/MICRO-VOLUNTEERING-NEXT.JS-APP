import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import emailModel from "@/lib/Modals/emailschema";


export async function POST(request: NextRequest) {
    const {sender, reciever, body, subject} = await request.json();
    const utcDate = new Date();
    const createdAt = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
    const received_time = createdAt.toISOString();

    try {
        connectToDatabase();
        const email_format = {
            sender,
            reciever,
            body,
            subject,
            received_time: received_time
        }

        let email = new emailModel(email_format);
        const result = await email.save();

        return NextResponse.json({ result ,success: true, message: 'email sent'});
        

        
    } catch (error) {
        return NextResponse.json({success: false, message: 'email failed to send', error: error});
    }


}