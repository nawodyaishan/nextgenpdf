export abstract class OpenAiConfig {
  public static readonly openAiApiKey = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY ?? '';
}
