import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeConfig } from '@/config/pinecone-config';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { AwsUtilsLib } from '@/lib/aws-utils-lib';
import { PdfPage } from '@/types/pdf-page';
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter';

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

  // 1. Reading content in the pdf
  // 2. Split and segment the pdf in to pages
  // 3. Vectorise and embed individual documents
  public static async loadS3IntoPinecone(fileKey: string, fileName: string, fs: any) {
    try {
      const downloadedFileName = await AwsUtilsLib.downloadFileFromS3(fileKey, fileName, fs);
      const langchainPdfLoader = new PDFLoader(downloadedFileName);
      const pdfPages = (await langchainPdfLoader.load()) as PdfPage[];
      const documents: Awaited<Document[]>[] = await Promise.all(
        pdfPages.map(this.prepareDownloadedDocument),
      );
    } catch (error: unknown) {
      console.error('Error reading the downloaded File From S3:', error);
      throw new Error(`Error reading the downloaded File From S3: ${error}`);
    }
  }

  public static async embedDocuments(documents: Document[]) {
    try {
    } catch (error: unknown) {
      console.error('Error truncateStringByBytes:', error);
      throw new Error(`Error truncateStringByBytes: ${error}`);
    }
  }

  public static async truncateStringByBytes(stringValue: string, bytes: number) {
    try {
      const encoder = new TextEncoder();
      return new TextDecoder('utf-8').decode(encoder.encode(stringValue).slice(0, bytes));
    } catch (error: unknown) {
      console.error('Error truncateStringByBytes:', error);
      throw new Error(`Error truncateStringByBytes: ${error}`);
    }
  }

  public static async prepareDownloadedDocument(page: PdfPage) {
    try {
      const { pageContent, metadata } = page;
      const cleanedPageContent = pageContent.replace(/\n/g, ' ');
      const splitter = new RecursiveCharacterTextSplitter();
      return splitter.splitDocuments([
        new Document({
          pageContent: cleanedPageContent,
          metadata: {
            pageNumber: metadata.loc.pageNumber,
            text: this.truncateStringByBytes(cleanedPageContent, 36000),
          },
        }),
      ]);
    } catch (error: unknown) {
      console.error('Error prepareDownloadedDocument:', error);
      throw new Error(`Error prepareDownloadedDocument: ${error}`);
    }
  }
}
