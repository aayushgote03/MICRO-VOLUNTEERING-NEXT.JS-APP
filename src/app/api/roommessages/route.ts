import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

// Initialize Pusher
const pusher = new Pusher({
  appId: "1945347",
  key: "72cb3b6362c5dc77cc6e",
  secret: "d8f962196983a5f7644b",
  cluster: "ap2",
  useTLS: true,
})


export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { message } = await req.json();
    
    

    // Trigger a Pusher event
    pusher.trigger(`private-chatroom`, 'new-message', message);

    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}