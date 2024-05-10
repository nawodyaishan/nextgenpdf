'use client';

import React from 'react';
import MessageList from '@/components/MessageList';
import { Input } from '@/components/ui/input';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { apiEndpoints } from '@/constants/api-endpoints-data';

type Props = { chatId: number };

export default function ChatComponent({ chatId }: Props) {
  // const { data, isLoading } = useQuery({
  //   queryKey: ['chat', chatId],
  //   queryFn: async () => {
  //     const response = await axios.post<Message[]>('/api/get-messages', {
  //       chatId,
  //     });
  //     return response.data;
  //   },
  // });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: apiEndpoints.chat,
    body: {
      chatId,
    },
    // initialMessages: data || [],
  });
  React.useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  return (
    <div className="relative max-h-screen overflow-scroll" id={'message-container'}>
      {/* header */}
      <div className="sticky inset-x-0 top-0 h-fit bg-white p-2">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>
      <MessageList messages={messages} />
      <form onSubmit={handleSubmit} className="sticky inset-x-0 bottom-0 bg-white px-2 py-4">
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="ml-2 bg-blue-600">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
