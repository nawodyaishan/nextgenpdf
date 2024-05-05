export interface IDataStoreState {
  chatResponse: CreateChatResponse | null;
  isLoading: boolean;
  createChat: (payload: CreateChatPayload) => Promise<false | CreateChatResponse>;
}

export interface CreateChatPayload {
  fileKey: string;
  fileName: string;
}

export interface CreateChatResponse {
  fileKey: string;
  fileName: string;
  status: number;
  isSuccess: boolean;
  pages?: any;
}
