'use client';

import * as React from 'react';
import { DrizzleChat } from '@/lib/db/schema';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

export default function ChatSideBar({ chats, chatId, isPro }: Props) {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="soff max-h-screen w-full overflow-scroll bg-gray-900 p-4 text-gray-200">
      <Link href="/">
        <Button className="w-full border border-dashed border-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </Link>

      <div className="mt-4 flex max-h-screen flex-col gap-2 overflow-scroll pb-20">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn('flex items-center rounded-lg p-3 text-slate-300', {
                'bg-blue-600 text-white': chat.id === chatId,
                'hover:text-white': chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap text-sm">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
