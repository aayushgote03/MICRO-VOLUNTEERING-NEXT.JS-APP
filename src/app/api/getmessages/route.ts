import {NextRequest, NextResponse} from "next/server";
import connectToDatabase from "@/lib/db";
import MessageModel from "@/lib/Modals/messages";

export async function POST(req: NextRequest) {
    const payload = await req.json();
    const { chatroomid } = payload;

    try {
        connectToDatabase();
        const messages = await MessageModel.find({ chatroomid: chatroomid });
        return NextResponse.json({messages: messages}, { status: 200 });
    } catch (error) {
        console.log(error, 'error');
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
    
}
