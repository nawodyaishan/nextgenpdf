import { Pinecone, PineconeRecord, RecordMetadata } from '@pinecone-database/pinecone';
import { PineconeConfig } from '@/config/pinecone-config';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { AwsUtilsLib } from '@/lib/aws-utils-lib';
import { PdfPage } from '@/types/pdf-page';
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter';
import { OpenaiUtilsLib } from '@/lib/openai-utils-lib';
import md5 from 'md5';
import { truncateStringByBytes } from '@/lib/utils';

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
  // 4. Upload to pinecone
  public static async loadS3IntoPinecone(fileKey: string, fileName: string, fs: any) {
    try {
      const downloadedFileName = await AwsUtilsLib.downloadFileFromS3(fileKey, fileName, fs);
      const langchainPdfLoader = new PDFLoader(downloadedFileName);
      const pdfPages = (await langchainPdfLoader.load()) as PdfPage[];
      const documents: Awaited<Document[]>[] = await Promise.all(
        pdfPages.map(this.prepareDownloadedDocument),
      );
      const vectors = await Promise.all(documents.flat().map(this.embedDocuments));
      const pineconeClient = this.getPineconeClient();
      const pineconeIndex = pineconeClient.index(PineconeConfig.pineconeDbIndex);
      console.log('----- 🚀 - Inserting vectors in to pinecone db ----');
      const namespace = this.convertToAscii(fileKey);
      await pineconeIndex.namespace(namespace).upsert(vectors);
      return documents[0];
    } catch (error: unknown) {
      console.error('Error reading the downloaded File From S3:', error);
      throw new Error(`Error reading the downloaded File From S3: ${error}`);
    }
  }

  public static async embedDocuments(document: Document) {
    try {
      const embeddingsFromOpenAi = await OpenaiUtilsLib.getEmbeddings(document.pageContent);
      const hashedContent = md5(document.pageContent);

      return {
        id: hashedContent,
        values: embeddingsFromOpenAi,
        metadata: {
          text: document.metadata.text,
          pageNumber: document.metadata.pageNumber,
        },
      } as PineconeRecord<RecordMetadata>;
    } catch (error: unknown) {
      console.error('Error embedDocuments:', error);
      throw new Error(`Error embedDocuments: ${error}`);
    }
  }

  public static async prepareDownloadedDocument(page: PdfPage) {
    try {
      const { pageContent, metadata } = page;
      const cleanedPageContent = pageContent.replace(/\n/g, ' ');
      const splitter = new RecursiveCharacterTextSplitter();
      console.log('Preparing to call truncateStringByBytes...');
      const text = truncateStringByBytes(cleanedPageContent, 36000);
      console.log('✅ - String truncated successfully.');
      return splitter.splitDocuments([
        new Document({
          pageContent: cleanedPageContent,
          metadata: {
            pageNumber: metadata.loc.pageNumber,
            text: text,
          },
        }),
      ]);
    } catch (error: unknown) {
      console.error('Error prepareDownloadedDocument:', error);
      throw new Error(`Error prepareDownloadedDocument: ${error}`);
    }
  }

  public static convertToAscii(inputString: string) {
    try {
      // remove non ascii characters
      return inputString.replace(/[^\x00-\x7F]+/g, '');
    } catch (error: unknown) {
      console.error('Error convertToAscii:', error);
      throw new Error(`Error convertToAscii: ${error}`);
    }
  }
}
