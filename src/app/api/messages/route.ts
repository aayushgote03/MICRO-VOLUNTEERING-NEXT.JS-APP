import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: "1945347",
  key: "72cb3b6362c5dc77cc6e",
  secret: "d8f962196983a5f7644b",
  cluster: "ap2",
  useTLS: true,
})

export async function POST(request: NextRequest) {
  const { message } = await request.json()

  try {
    const res = await pusher.trigger('chat-channel', 'new-message', {
        message,
      })

      return NextResponse.json({ success: true })
    
  } catch (error) {
    console.log(error);
    
  }
  return NextResponse.json({ success: true })
}