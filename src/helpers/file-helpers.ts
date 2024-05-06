import { Bounce, toast } from 'react-toastify';
import { FileUploadingMode } from '@/types/file-uploading-mode';

export abstract class FileHelpers {
  public static validateFileSize(file: File, maxSize: number): boolean {
    if (file.size > maxSize) {
      toast.error(
        'File size is too large (max ' +
          (maxSize / (1024 * 1024)).toFixed(2) +
          'MB). Please try uploading a smaller file.',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        },
      );
      return false;
    }
    return true;
  }

  public static getFileUploadingMode(isLoading: boolean, isFileUploading: boolean) {
    if (!isLoading && !isFileUploading) {
      return FileUploadingMode.idle;
    } else if (!isLoading && isFileUploading) {
      return FileUploadingMode.fileUploading;
    } else if (isLoading && !isFileUploading) {
      return FileUploadingMode.fileLoading;
    } else if (isLoading && isFileUploading) {
      return FileUploadingMode.fileUploading;
    } else {
      return FileUploadingMode.idle;
    }
  }
}
