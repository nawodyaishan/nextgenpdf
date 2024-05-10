export interface ChatDTO {
  id?: number;
  pdfName: string;
  pdfUrl: string;
  createdAt?: string;
  userId: string;
  fileKey: string;
}

export interface MessageDTO {
  id?: number;
  chatId: number;
  content: string;
  createdAt?: string;
  role: 'user' | 'system' | 'otherRole';
}
