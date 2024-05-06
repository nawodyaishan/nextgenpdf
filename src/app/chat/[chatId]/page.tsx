import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Bounce, toast } from 'react-toastify';
import { DatabaseService } from '@/lib/db/services/database-service';
import { chatsTable } from '@/lib/db/schemas/schema';
import { eq } from 'drizzle-orm';

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
  if (!chats || chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect('/');
  }

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex max-h-screen w-full overflow-scroll">
        {/* chat sidebar */}
        <div className="max-w-xs flex-[1]">
          {/*<ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />*/}
        </div>
        {/* pdf viewer */}
        <div className="oveflow-scroll max-h-screen flex-[5] p-4">
          {/*<PDFViewer pdf_url={currentChat?.pdfUrl || ''} />*/}
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          {/*<ChatComponent chatId={parseInt(chatId)} />*/}
        </div>
      </div>
    </div>
  );
}
