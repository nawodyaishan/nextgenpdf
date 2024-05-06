export interface IDataStoreState {
  chatResponse: CreateChatResponse | null;
  isLoading: boolean;
  createChat: (payload: CreateChatPayload) => Promise<false | CreateChatResponse>;
}

export interface CreateChatPayload {
  fileKey: string;
  fileName: string;
  userId: string;
}

export interface CreateChatResponse {
  fileKey: string;
  fileName: string;
  chatId: number;
  status: number;
  isSuccess: boolean;
  pages?: any;
}
