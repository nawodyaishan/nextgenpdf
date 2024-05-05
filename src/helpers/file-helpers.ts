import { Bounce, toast } from 'react-toastify';

export abstract class FileHelpers {
  static validateFileSize(file: File, maxSize: number): boolean {
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
}