export abstract class PineconeConfig {
  public static readonly pineconeDbApiKey = process.env.NEXT_PUBLIC_PINECONE_DB_API_KEY ?? '';
  public static readonly pineconeDbEnv = process.env.NEXT_PUBLIC_PINECONE_ENV ?? '';
  public static readonly pineconeDbIndex = process.env.NEXT_PUBLIC_PINECONE_INDEX ?? '';
}
