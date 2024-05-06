import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAiConfig } from '@/config/open-ai-config';
import { openAiApiModels } from '@/constants/openai-models-data';

/**
 * OpenAI Utility Library
 *
 * This class provides utility functions for interacting with the OpenAI API.
 */
export abstract class OpenaiUtilsLib {
  /**
   * Instance of the OpenAI API service
   *
   * This variable stores a cached instance of the OpenAI API service.
   * We use a singleton pattern to avoid creating multiple instances.
   */
  private static openAiApiService: OpenAIApi | null = null;

  /**
   * Gets an instance of the OpenAI API service
   *
   * This function retrieves a cached instance of the OpenAI API service
   * or creates a new one using the provided API key from the configuration.
   *
   * @throws {Error} - If there's an error initializing the OpenAI API service
   *
   * @returns {Promise<OpenAIApi>} - Promise resolving to an instance of the OpenAI API service
   */
  public static async getOpenAiApiService(): Promise<OpenAIApi> {
    if (!this.openAiApiService) {
      try {
        const openAiConfig = new Configuration({
          apiKey: OpenAiConfig.openAiApiKey,
        });

        this.openAiApiService = new OpenAIApi(openAiConfig);
      } catch (error) {
        console.error('Failed to initialize openAiApi service:', error);
        throw error;
      }
    }
    return this.openAiApiService;
  }

  /**
   * Gets embedding vectors for a given text string
   *
   * This function retrieves embedding vectors for a provided text string using the OpenAI API.
   * It replaces newline characters with spaces before sending the text for embedding.
   *
   * @param {string} text - The text string for which to generate embeddings
   *
   * @throws {Error} - If there's an error during the embedding process
   *
   * @returns {Promise<number[]>} - Promise resolving to an array of embedding vectors (numbers)
   */
  public static async getEmbeddings(text: string): Promise<number[]> {
    try {
      const openAiApiService = await this.getOpenAiApiService();
      const openAiApiResponse = await openAiApiService.createEmbedding({
        input: text.replace(/\n/g, ' '),
        model: openAiApiModels.TextEmbedding3Small, // Change to desired model (e.g., TextEmbedding3Large)
      });
      const responseJson = await openAiApiResponse.json();
      console.log('OpenAI API response:', responseJson); // Log the full response
      if (!responseJson.data || !responseJson.data[0] || !responseJson.data[0].embedding) {
        throw new Error('Unexpected response structure from OpenAI API');
      }
      return responseJson.data[0].embedding as number[];
    } catch (error) {
      console.error('Error at getEmbeddings:', error);
      throw error;
    }
  }
}
