import { DatabaseService } from '@/lib/db/services/database-service';
import { chatsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm'; // Function to fetch the latest chatId of the userId

// Function to fetch the latest chatId of the userId
export default async (userId: string | null): Promise<number | null> => {
  if (!userId) {
    return null;
  }

  try {
    // Fetch chats associated with the userId
    const chats = await DatabaseService.getNeonHttpDatabase()
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.userId, userId));

    // Find the latest chatId
    const latestChat = chats.reduce(
      (latest, chat) => {
        return chat.id > latest.id ? chat : latest;
      },
      { id: -1 },
    ); // Start with an invalid id to ensure it gets updated

    return latestChat.id;
  } catch (error) {
    console.error('Error fetching latest chatId:', error);
    return null;
  }
};
