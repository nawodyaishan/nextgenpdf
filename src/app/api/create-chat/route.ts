import { NextRequest, NextResponse } from 'next/server';
import { CreateChatPayload, CreateChatResponse } from '@/interfaces/i-data-store-state';

export async function POST(request: NextRequest) {
  try {
    const createChatPayload: CreateChatPayload = await request.json();
    console.log('🔔 - CreateChatPayload from frontend', createChatPayload);
    const responseData: CreateChatResponse = {
      isSuccess: true,
      fileKey: createChatPayload.fileKey,
      fileName: createChatPayload.fileName,
      status: 200,
    };
    return NextResponse.json({
      responseData,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      error: 'Internal Server Error',
      status: 500,
    });
  }
}
