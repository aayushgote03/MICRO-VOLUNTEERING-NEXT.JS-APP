import { NextResponse, NextRequest } from "next/server";
import Pusher from "pusher";
import connectToDatabase from "@/lib/db";
import MessageModel from "@/lib/Modals/messages";
import UserModel from "@/lib/Modals/userschema";

const pusher = new Pusher({
  appId: "1945347",
  key: "72cb3b6362c5dc77cc6e",
  secret: "d8f962196983a5f7644b",
  cluster: "ap2",
  useTLS: true, 
});

export async function POST(req: NextRequest) {
  
    const payload = await req.json();
    console.log(payload, 'payload');
    const { room, message, sendermail} = payload;
    console.log(sendermail, 'sendermail');
    
    await pusher.trigger(room, "new-message", message);
    
    try {
      connectToDatabase();
      const sender = await UserModel.findOne({ email: sendermail });
      console.log(sender, 'sender');
      const newmessage = new MessageModel({
        senderid: sender._id,
        sendername: sender.handlename,
        message: message.text,
        chatroomid: room,
        createdAt: message.time,
      })
      await newmessage.save();
      
    } catch (error) {
      console.log(error, 'error');
      return NextResponse.json({ success: false, error: "Failed to save message" }, { status: 500 });  
    }
    
    return NextResponse.json({ success: true });

}
