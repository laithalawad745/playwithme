import Pusher from 'pusher';
import { NextResponse } from 'next/server';

const pusher = new Pusher({
  appId: "2046854",
  key: "39e929ae966aeeea6ca3", 
  secret: "d3729a93045287b3e17b",
  cluster: "us2",
  useTLS: true,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { channel, event, data } = body;


    await pusher.trigger(channel, event, data);
    
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to trigger event', details: error.message }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Pusher API is working!' });
}