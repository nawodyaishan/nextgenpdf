import { NextRequest, NextResponse } from 'next/server';
import { ChatPayload } from '@/interfaces/i-data-store-state';
import { auth } from '@clerk/nextjs/server';
import { OpenaiUtilsLib } from '@/lib/openai-utils-lib';
import {
  ChatCompletionRequestMessageRoleEnum,
  CreateChatCompletionRequest,
  OpenAIApi,
} from 'openai-edge';
import { openAiApiModels } from '@/constants/openai-models-data';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { PineconeUtilsLib } from '@/lib/pinecone-utils-lib';
import { DatabaseService } from '@/lib/db/services/database-service';
import { chatsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const { userId } = auth();

  try {
    const chatPayload: ChatPayload = await request.json();
    console.log('🔔 - CreateChatPayload from frontend', chatPayload);
    const lastMessage = chatPayload.messages[chatPayload.messages.length - 1];
    const chats = await DatabaseService.getNeonHttpDatabase()
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.id, chatPayload.chatId));
    if (chats.length !== 1 || !lastMessage.content) {
      return NextResponse.json({
        error: 'Internal Server Error : no chat found',
        status: 404,
      });
    }
    const fileKey = chats[0].fileKey;
    const context = await PineconeUtilsLib.getContext(lastMessage.content, fileKey);
    console.log(' Create Chat Completion context', context);

    const prompt = {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
    };

    const openAiApi: OpenAIApi = await OpenaiUtilsLib.getOpenAiApiService();
    const params: CreateChatCompletionRequest = {
      model: openAiApiModels.gpt_3_5_turbo,
      messages: [
        prompt,
        ...chatPayload.messages.filter((message) => {
          return message.role === 'user';
        }),
      ],
      stream: true,
    };
    const response = await openAiApi.createChatCompletion(params);
    console.log(' Create Chat Completion response', response);
    const stream = OpenAIStream(response);
    // const responseData: ChatResponse = {
    //   isSuccess: true,
    //   streamingTextResponse,
    //   status: 200,
    // };
    // console.log('🔔 - ChatResponse from Backend', responseData);
    // return NextResponse.json({
    //   ...responseData,
    // });
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      error: 'Internal Server Error',
      status: 500,
    });
  }
}
