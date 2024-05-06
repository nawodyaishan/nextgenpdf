import { NextRequest, NextResponse } from 'next/server';
import { CreateChatPayload, CreateChatResponse } from '@/interfaces/i-data-store-state';
import * as fs from 'node:fs';
import { PineconeUtilsLib } from '@/lib/pinecone-utils-lib';
import { DatabaseService } from '@/lib/db/services/database-service';
import { AwsUtilsLib } from '@/lib/aws-utils-lib';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  const { userId } = auth();

  try {
    const createChatPayload: CreateChatPayload = await request.json();
    console.log('🔔 - CreateChatPayload from frontend', createChatPayload);

    if (!userId || createChatPayload.userId !== userId) {
      console.error('User id is not valid or unauthorized');
      return NextResponse.json({
        error: 'User id is not valid or unauthorized',
        status: 401,
      });
    }

    console.log('📁 - Writing Pinecone Database and PDF Processing');
    const pages = await PineconeUtilsLib.loadS3IntoPinecone(
      createChatPayload.fileKey,
      createChatPayload.fileName,
      fs,
    );
    console.log('📁 - Pages Content :', JSON.stringify(pages));

    console.log('📁 - Writing Database');
    const chatIds = await DatabaseService.createChat({
      pdfName: createChatPayload.fileName,
      fileKey: createChatPayload.fileKey,
      pdfUrl: AwsUtilsLib.getS3Url(createChatPayload.fileKey),
      userId: userId,
    });

    const responseData: CreateChatResponse = {
      isSuccess: true,
      chatId: chatIds[0].insertedId,
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
