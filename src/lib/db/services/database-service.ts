import { neon, neonConfig } from '@neondatabase/serverless';
import { AppConfig } from '@/config/app-config';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { ChatDTO } from '@/interfaces/dtos';
import { chatsTable } from '@/lib/db/schemas/schema';

export class DatabaseService {
  private static neonHttpDatabase: NeonHttpDatabase | null = null;

  /**
   * Returns the singleton instance of the Pinecone client.
   * Initializes the client if it has not been already.
   */
  public static getNeonHttpDatabase(): NeonHttpDatabase {
    if (!this.neonHttpDatabase) {
      try {
        neonConfig.fetchConnectionCache = true;
        const postgresSql = neon(AppConfig.neonDbUrl);
        this.neonHttpDatabase = drizzle(postgresSql);
      } catch (error: any) {
        console.error('Failed to initialize Pinecone client:', error);
        throw new Error('Initialization of Pinecone client failed');
      }
    }
    return this.neonHttpDatabase;
  }

  public static async createChat(dto: ChatDTO) {
    try {
      const db = this.getNeonHttpDatabase();
      return await db
        .insert(chatsTable)
        .values({
          fileKey: dto.fileKey,
          pdfName: dto.pdfName,
          pdfUrl: dto.pdfUrl,
          userId: dto.userId,
        })
        .returning({
          insertedId: chatsTable.id,
        });
    } catch (error: unknown) {
      console.error('Error embedDocuments:', error);
      throw new Error(`Error embedDocuments: ${error}`);
    }
  }
}
