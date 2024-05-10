import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Bounce, toast } from 'react-toastify';
import { DatabaseService } from '@/lib/db/services/database-service';
import { chatsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { checkSubscription } from '@/lib/subscription';
import React from 'react';
import ChatComponent from '@/components/ChatComponent';
import PDFViewer from '@/components/PDFViewer';
import ChatSideBar from '@/components/ChatSideBar';

export type ChatPageProps = {
  params: {
    chatId: string;
  };
};

export default async function ChatPage({ params: { chatId } }: ChatPageProps) {
  const { userId } = auth();
  if (!userId) {
    toast.error(`User not signed in!`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce,
    });
    return redirect('/sign-in');
  }

  const chats = await DatabaseService.getNeonHttpDatabase()
    .select()
    .from(chatsTable)
    .where(eq(chatsTable.userId, userId));
  if (!chats || !chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect('/');
  }
  const currentChat = chats.find((chat) => chat.id === parseInt(chatId));
  const isPro = await checkSubscription();

  return (
    <div className="flex h-full min-h-screen overflow-hidden">
      <div className="flex max-h-screen w-full overflow-scroll">
        {/* chat sidebar */}
        <div className="max-w-xs flex-[1]">
          <ChatSideBar chats={chats} chatId={parseInt(chatId)} isPro={isPro} />
        </div>
        {/* pdf viewer */}
        {currentChat && (
          <div className="oveflow-scroll max-h-screen flex-[5] p-4">
            <PDFViewer pdf_url={currentChat.pdfUrl || ''} />
          </div>
        )}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
}
