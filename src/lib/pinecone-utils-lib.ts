import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeConfig } from '@/config/pinecone-config';

export class PineconeUtilsLib {
  private static pineconeClient: Pinecone | null = null;

  // Private constructor to prevent instantiation
  private constructor() {}

  /**
   * Returns the singleton instance of the Pinecone client.
   * Initializes the client if it has not been already.
   */
  public static getPineconeClient(): Pinecone {
    if (!this.pineconeClient) {
      try {
        this.pineconeClient = new Pinecone({
          apiKey: PineconeConfig.pineconeDbApiKey,
        });
      } catch (error: any) {
        console.error('Failed to initialize Pinecone client:', error);
        throw new Error('Initialization of Pinecone client failed');
      }
    }
    return this.pineconeClient;
  }
}
