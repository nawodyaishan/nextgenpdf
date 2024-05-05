import { NextRequest, NextResponse } from 'next/server';
import { CreateChatPayload, CreateChatResponse } from '@/interfaces/i-data-store-state';
import * as fs from 'node:fs';
import { PineconeUtilsLib } from '@/lib/pinecone-utils-lib';

export async function POST(request: NextRequest) {
  try {
    const createChatPayload: CreateChatPayload = await request.json();
    console.log('🔔 - CreateChatPayload from frontend', createChatPayload);

    // Logic starts here
    const pages = await PineconeUtilsLib.loadS3IntoPinecone(
      createChatPayload.fileKey,
      createChatPayload.fileName,
      fs,
    );

    console.log('📁 - Pages Content :', JSON.stringify(pages));

    const responseData: CreateChatResponse = {
      isSuccess: true,
      fileKey: createChatPayload.fileKey,
      fileName: createChatPayload.fileName,
      status: 200,
      pages: pages,
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
