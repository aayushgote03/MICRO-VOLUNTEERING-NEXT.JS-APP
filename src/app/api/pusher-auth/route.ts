import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
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
    const { socket_id, channel_name } = await req.json();

    // Authenticate the user
    const authResponse = pusher.authenticateUser(socket_id, channel_name);

    // Return the authentication response
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher authentication error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}