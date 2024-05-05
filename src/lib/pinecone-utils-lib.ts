import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeConfig } from '@/config/pinecone-config';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { AwsUtilsLib } from '@/lib/aws-utils-lib';
import { PdfPage } from '@/types/pdf-page';

export class PineconeUtilsLib {
  private static pineconeClient: Pinecone | null = null;

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

  // Reading content in the pdf
  public static async loadS3IntoPinecone(fileKey: string, fileName: string, fs: any) {
    try {
      const downloadedFileName = await AwsUtilsLib.downloadFileFromS3(fileKey, fileName, fs);
      const langchainPdfLoader = new PDFLoader(downloadedFileName);
      return (await langchainPdfLoader.load()) as PdfPage[];
    } catch (error: any) {}
  }
}
