import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateStringByBytes(stringValue: string, bytes: number) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(stringValue);
  console.log('✅ - Encoded length:', encoded.length);
  if (bytes > encoded.length) {
    bytes = encoded.length;
  }
  const truncated = new TextDecoder('utf-8').decode(encoded.slice(0, bytes));
  console.log('✅ - Truncation completed successfully.');
  return truncated;
}
